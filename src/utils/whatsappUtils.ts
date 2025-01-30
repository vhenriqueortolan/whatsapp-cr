import { removeSessionFromDB } from "./dbUtils.js";
import { Types } from "mongoose";
import { instances } from "../services/whatsappService.js";
import { WASocket } from "@whiskeysockets/baileys";

// Função para enviar mensagem
export async function sendMessage(sock: any, to: string, message: string) {
  if (sock) {
    try {
      const [result] = await sock.onWhatsApp(to)
      if (result.exists){
          const messageStatus = await getMessageStatus(sock, result.jid, message);
          console.log(`Mensagem para ${to}: ${message}`);
          return messageStatus
      } else {
        return {status: 'failed', error: 'Whatsapp não existe', to}
      }
    } catch (error) {
      console.error(`Erro para encontrar ID: ${error}`);
      const err = `Erro para encontrar ID: ${error}`
      throw err
    }
  } else {
    const error = 'Conexão com WhatsApp não foi estabelecida'
    console.error(error);
    throw error
  }
}

export async function disconnectWhatsApp(userId: Types.ObjectId): Promise<void> {
  const sock = await instances.get(userId as unknown as string);

  if (!sock) {
      console.log(`Nenhuma sessão ativa para o usuário: ${userId}`);
      return;
  }

  try {
      // Remove a sessão do banco de dados
      await removeSessionFromDB(userId);
      console.log(`Removida do banco de dados a sessão de whatsapp para o usuário ${userId}`);

      // Fecha a conexão do WhatsApp
      await sock.logout();
      console.log(`A sessão de whatsapp do usuário ${userId} foi encerrada`);

      // Remove a instância do cache
      instances.delete(userId.toString());
      console.log(`Removida a instância de whatsapp para o usuário ${userId}`);
  } catch (error) {
      console.error(`Erro ao disconectar do whatsapp o usuário ${userId}:`, error);
  }
}

export async function getMessageStatus(sock: WASocket, groupJid: string, message: string){
  return new Promise((resolve, reject) => {
    // Envia a mensagem
    sock
      .sendMessage(groupJid, {text: message, linkPreview: null})
      .then((response: any) => {
        console.log({...response})
        const messageId = response?.key.id; // Captura o ID da mensagem enviada

        // Listener para mudanças de status
        const onMessageUpdate = (updates: any) => {
          Object.values(updates).forEach((update: any) => {
            // Verifica se o objeto `update` contém `key.id`
            if (update?.key?.id) {
              if (update.key.id === messageId) {
                const status = update.update?.status; // Certifique-se de que `status` existe
                if (status === 1) { // Exemplos de status
                  sock.ev.off('messages.update', onMessageUpdate); // Remove o listener
                  resolve({ status, messageId });
                }
              }
            } else {
              console.warn('Atualização de mensagem sem informações completas:', update);
            }
          });
        };

        if(response.status === 'serverAck' || response?.status === 'delivered' || response?.status === 'read' || response?.status === 1){
          sock.ev.off('messages.update', onMessageUpdate);
          resolve({ status: response.status, messageId });
        }

        // Escuta o evento de atualização de mensagem
        sock.ev.on('messages.update', onMessageUpdate);

        // Opcional: Define um timeout para evitar espera indefinida
        setTimeout(() => {
          sock.ev.off('messages.update', onMessageUpdate);
          reject(new Error('Tempo limite atingido para o envio da mensagem.'));
        }, 30000); // 30 segundos
      })
      .catch((err) => {
        reject(err); // Rejeita em caso de erro no envio
      });
  });
}

export async function getGroupMetadata(sock: WASocket, groupJid: string){
  try {
    const metadata = await sock.groupMetadata(groupJid);
    const participantJids = metadata.participants.map((p) => p.id);

    // Verifica as chaves para cada participante individualmente
    const results = await Promise.all(
        participantJids.map((jid) => sock.onWhatsApp(jid))
    );

    const missingKeys = participantJids.filter(
        (_, index) => !results[index] || results[index].length === 0
    );

    if (missingKeys.length > 0) {
        console.warn('Participantes com chaves ausentes:', missingKeys);
    } else {
        console.log('Todos os participantes têm chaves válidas.');
    }
  } catch (err) {
      console.error('Erro ao verificar chaves dos participantes:', err);
  }
}