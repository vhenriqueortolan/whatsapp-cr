import { WASocket } from "@whiskeysockets/baileys";
import { responses } from "./responses.js";

   //Monitora novas mensagens para salvar um grupo no Banco de Dados
export async function listenMessages(sock: WASocket){
sock.ev.on("messages.upsert", async (newMessage) => {
    const { messages, type } = newMessage;

    if (type === "notify") { // Mensagem nova
        const message = messages[0];

        if (!message.key.fromMe) { // Filtra mensagens recebidas
            const whatsappId: any = message.key.remoteJid; // ID do remetente (grupo ou contato)
            const isGroup = whatsappId.endsWith("@g.us"); // Verifica se é grupo
            const msg = message.message?.conversation || message.message?.extendedTextMessage?.text;
            if (msg){
                const call = responses.find(response => msg.includes(response.call))
                if(call){
                    await call.action({msg, whatsappId})
                    .then(async (text)=>{
                        await sock.sendMessage(whatsappId, { text })
                    })
                    .catch(async (text)=>{
                        await sock.sendMessage(whatsappId, { text })
                    })
                } 
            }
        }
    }
    })
}