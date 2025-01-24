import { useMultiFileAuthState, DisconnectReason, makeWASocket } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import dotenv from 'dotenv'

dotenv.config()

// Variável para armazenar a instância do socket
let sock: any;

async function connectToWhatsApp() {
  // Usando o estado de autenticação
  const { state, saveCreds } = await useMultiFileAuthState(process.env.PORT as string);

  // Criando a conexão com o WhatsApp, agora incluindo 'auth'
  sock = makeWASocket({
    auth: state,           // Adicionando o estado de autenticação
    printQRInTerminal: true, // Exibe o QR Code no terminal
    markOnlineOnConnect: false
  });

  // Monitorando a atualização da conexão
  sock.ev.on('connection.update', (update: { connection: any; lastDisconnect: any; }) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('Connection closed due to ', lastDisconnect.error, ', reconnecting: ', shouldReconnect);
      if (shouldReconnect) {
        connectToWhatsApp(); // Reconectar automaticamente
      }
    } else if (connection === 'open') {
      console.log('Opened connection');
    }
  });
  sock.ev.on('creds.update', saveCreds)
}

export { connectToWhatsApp, sock };
