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
          await sock.sendMessage(result.jid, { text: message, linkPreview: false });
          console.log(`Mensagem para ${to}: ${message}`);
          return {status: 'success', to}
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
      // Fecha a conexão do WhatsApp
      await sock.logout();
      console.log(`A sessão de whatsapp do usuário ${userId} foi encerrada`);

      // Remove a instância do cache
      instances.delete(userId.toString());
      console.log(`Removida a instância de whatsapp para o usuário ${userId}`);

      // Remove a sessão do banco de dados
      await removeSessionFromDB(userId);
      console.log(`Removida a sessão de whatsapp para o usuário ${userId}`);
  } catch (error) {
      console.error(`Erro ao disconectar do whatsapp o usuário ${userId}:`, error);
  }
}

export async function sendToGroup(sock: WASocket, groupJid: string, message: string){
  try {
    const send = await sock.sendMessage(groupJid, {text: message})
    return send
  } catch (error) {
    console.error('erro para enviar a mensagem: ', error)
    throw error
  }
}