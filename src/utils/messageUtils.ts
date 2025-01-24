import { error } from "console";
import { sock } from "services/whatsappService"; 

// Função para enviar mensagem
async function sendMessage(to: string, message: string) {
  if (sock) {
    try {
      const [result] = await sock.onWhatsApp(to)
      if (result.exists){
          await sock.sendMessage(result.jid, { text: message });
          console.log(`Mensagem para ${to}: ${message}`);
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

export { sendMessage }