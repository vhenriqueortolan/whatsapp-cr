import { WASocket } from "@whiskeysockets/baileys";
import { responses } from './responses.js'

export function listenGroupMessages(sock: WASocket){
      // Monitorando mensagens recebidas
  sock.ev.on('messages.upsert', async (msg) => {
    const messages = msg.messages;

    for (const message of messages) {
        // Verifica se a mensagem veio de um grupo
        if (message.key.remoteJid?.endsWith('@g.us')) {
            const whatsappId = message.key.remoteJid; // ID do grupo
            const senderJid = message.key.participant; // ID do remetente
            const msg = message.message?.conversation || '';
            const call = await responses.find(response => msg.includes(response.call))
            if(call){
                await call.action({msg, whatsappId})
                    .then(async (text)=>{
                        await sock.sendMessage(whatsappId, { text })
                    })
                    .catch(async (text)=>{
                        await sock.sendMessage(whatsappId, { text })
                    })
            }
            console.log(`Nova mensagem no grupo ${whatsappId} de ${senderJid}: ${msg}`);
        }
      }
    })
}