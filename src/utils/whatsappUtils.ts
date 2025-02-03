import { removeSessionFromDB } from "./dbUtils.js";
import { Types } from "mongoose";
import { instances } from "../services/whatsappService.js";
import { WASocket } from "@whiskeysockets/baileys";
import Photographer from "../models/Photographer.js";
import Booking from "../models/Booking.js";

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

      // Remove a instância do cache
      instances.delete(userId.toString());
      console.log(`Removida a instância de whatsapp para o usuário ${userId}`);

      // Fecha a conexão do WhatsApp
      await sock.logout();
      console.log(`A sessão de whatsapp do usuário ${userId} foi encerrada`);

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

   //Monitora novas mensagens para salvar um grupo no Banco de Dados
export async function listenMessages(sock: WASocket){
  sock.ev.on("messages.upsert", async (message) => {
    const { messages, type } = message;

    if (type === "notify") { // Mensagem nova
        const msg = messages[0];
        
        if (!msg.key.fromMe) { // Filtra mensagens recebidas
            const remoteJid: any = msg.key.remoteJid; // ID do remetente (grupo ou contato)
            const isGroup = remoteJid.endsWith("@g.us"); // Verifica se é grupo
            const messageText = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
            if(isGroup){
              if (messageText?.includes('#salvargrupo')){
                try {
                  const username = messageText.split(' ')[1]
                  const photo = await Photographer.findOne({'username': username})
                  if(photo){
                    photo.whatsappId = remoteJid
                    await photo.save()
                    await sock.sendMessage(remoteJid, { text: "Grupo salvo!" });
                    console.log(`Grupo salvo para o usuário ${username}`)
                  } else {
                    await sock.sendMessage(remoteJid, { text: `Não encontrei o usuário ${username}` });
                    console.log(`Não encontrei o usuário ${username}`)
                  }
                } catch (error: any) {
                  await sock.sendMessage(remoteJid, { text: `Ops! Erro pra salvar o grupo: ${error.message}` });
                }
              }
            }
            if (messageText === '#hoje'){
              try {
                  const today = new Intl.DateTimeFormat('pt-BR').format(new Date(
                  new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
                ));
                const bookings = await Booking.find({'schedule.start.day': today})
                .sort({ 'schedule.start.hour': 1 }); // Ordena de forma crescente (1 = ascendente)
      
                if(bookings.length == 0){
                  sock.sendMessage(remoteJid, {text: 'Hmmm... Vi aqui e hoje não tem nenhum agendamento até agora'})
                  return
                }
                let text = `Aqui estão os agendamentos que encontrei para o dia hoje:`
                bookings.forEach((agendamento: any) => {
                  const { start, end } = agendamento.schedule;
                  const { address, neighborhood } = agendamento.property;
                  const { services } = agendamento;
                  let { name: corretor, whatsapp: corretorWhatsapp } = agendamento.broker;
                  const { notes } = agendamento;
              
                  // Construa a parte da mensagem para o agendamento
                  text += `
\n
Endereço: *${address}, ${neighborhood}*
Horário: *${start.hour} - ${end}*
Serviços: ${services}
Corretor: ${corretor} - WhatsApp: ${corretorWhatsapp.slice(2)}
${notes ? `Obs: ${notes}` : ''}`;  // Adiciona um espaçamento entre os agendamentos
                });
                sock.sendMessage(remoteJid, {text})
              } catch (error:any) {
                await sock.sendMessage(remoteJid, { text: `Ops! Erro: ${error.message}` });
              }
            }
            if (messageText?.includes('#data')){
              const date: any = messageText.split(' ')[1]
              try {
                const bookings: any = await Booking.find({'schedule.start.day': date})
                .sort({ 'schedule.start.hour': 1 }); // Ordena de forma crescente (1 = ascendente)
                if(bookings.length == 0){
                  sock.sendMessage(remoteJid, {text: `Hmmm... Ninguém marcou fotos para o dia ${date} até agora, o jeito é esperar...`})
                  return
                }
                let text = `Aqui estão os agendamentos que encontrei para o dia ${date}:`
                bookings.forEach((agendamento: any) => {
                  const { start, end } = agendamento.schedule;
                  const { address, neighborhood } = agendamento.property;
                  const { services } = agendamento;
                  let { name: corretor, whatsapp: corretorWhatsapp } = agendamento.broker;
                  const { notes } = agendamento;
              
                  // Construa a parte da mensagem para o agendamento
                  text += `
\n
Endereço: *${address}, ${neighborhood}*
Horário: *${start.hour} - ${end}*
Serviços: ${services}
Corretor: ${corretor} - WhatsApp: ${corretorWhatsapp.slice(2)}
${notes ? `Obs: ${notes}` : ''}`;  // Adiciona um espaçamento entre os agendamentos
                });
                sock.sendMessage(remoteJid, {text})
              } catch (error:any) {
                await sock.sendMessage(remoteJid, { text: `Ops! Erro: ${error.message}` });
              }
            }
        }
    }
});
}