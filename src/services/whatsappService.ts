import {DisconnectReason, makeWASocket, initAuthCreds, AuthenticationCreds, SignalDataTypeMap, WASocket } from '@whiskeysockets/baileys';
import dotenv from 'dotenv'
import { Types } from 'mongoose'
import { Boom } from '@hapi/boom';
import { getSessionFromDB, removeSessionFromDB, saveSessionToDB } from '../utils/dbUtils.js';

dotenv.config()

type State = {
  creds: AuthenticationCreds;
  keys: {
      get: (type: keyof SignalDataTypeMap, ids: string[]) => Record<string, any>;
      set: (data: Record<string, Record<string, any>>) => void;
  };
};

// Variável para armazenar a instância do socket
const instances: Map<string, WASocket> = new Map();

async function connectToWhatsApp(userId: string): Promise<WASocket> {
  // Verifica se já existe uma instância para o usuário
  if (instances.has(userId)) {
      console.log(`Returning existing WhatsApp instance for user ${userId}`);
      return instances.get(userId as unknown as string)!;
  }

  // Recupera credenciais e chaves do banco de dados
  const session = await getSessionFromDB(userId as unknown as Types.ObjectId);
  const creds = session?.creds || initAuthCreds();
  let keys = session?.keys || {};

  // Configuração do estado de autenticação
  const state = {
      creds,
      keys: {
          get: (type: string, ids: string[]) => {
              const data: Record<string, any> = {};
              for (const id of ids) {
                  data[id] = keys[type]?.[id];
              }
              return data;
          },
          set: (data: Record<string, any>) => {
              for (const type in data) {
                  if (!keys[type]) keys[type] = {};
                  Object.assign(keys[type], data[type]);
              }
          },
      },
  };

  // Função para salvar as credenciais no banco de dados
  const saveCreds = async () => {
      await saveSessionToDB(userId as unknown as Types.ObjectId, state.creds, keys);
  };

  // Criando a conexão com o WhatsApp
  const sock = makeWASocket({
      auth: state,
      printQRInTerminal: true, // Para ambiente de desenvolvimento
      markOnlineOnConnect: false,
  });

  // Monitorando a atualização da conexão
  sock.ev.on('connection.update', async (update: any) => {
      const { connection, lastDisconnect } = update;

      if (connection === 'close') {
          const shouldReconnect =
              (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
          console.log('Connection closed due to', lastDisconnect?.error, ', reconnecting:', shouldReconnect);

          // Remove do cache se desconectado permanentemente
          if (!shouldReconnect) {
              instances.delete(userId.toString());
              console.log(`Removed WhatsApp instance for user ${userId}`);
          }

          // Reconectar se necessário
          if (shouldReconnect) {
              await connectToWhatsApp(userId);
          }
      } else if (connection === 'open') {
          console.log('Opened connection for user', userId);
            // Salva a instância no cache
          instances.set(userId.toString(), sock);
          console.log(`New WhatsApp instance created for user ${userId}`);
      }
  });

  // Monitorando atualizações de credenciais
  sock.ev.on('creds.update', saveCreds);
  return sock
}


export { connectToWhatsApp, instances };
