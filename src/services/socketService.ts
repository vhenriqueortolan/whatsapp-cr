import { Server } from "socket.io";
import { connectToWhatsApp, instances } from "./whatsappService.js";
import { disconnectWhatsApp } from "../utils/whatsappUtils.js";

// Configuração do Socket.IO
export default async function initSocket(io:Server) {
    io.on('connection', (socket) => {
        console.log('Cliente conectado');
        let sock: any

        socket.on('check-status',(userId)=>{
            sock = instances.get(userId)
            if(sock){
                socket.emit('session-started', { status: 'success', userId });
            }
        })

        socket.on('start-session', async (userId: string) => {
            console.log(`Iniciando sessão para o usuário ${userId}`);
            sock = instances.get(userId)
            if(sock){
                socket.emit('session-started', { status: 'success', userId });
                return
            }
            // Conectando ao WhatsApp
            sock = await connectToWhatsApp(userId);
            sock.ev.on('connection.update', (update: any) => {
                const {qr} = update
                socket.emit('qr-code', qr); // Envia o QR Code para o cliente
            });
        });

        socket.on('connected', (userId)=>{
            setTimeout(()=>{
                sock = instances.get(userId)
                if (sock){
                    socket.emit('session-started', {status: 'success', userId})
                }
            }, 8000)
        })

        socket.on("delete-session", async (userId)=>{
            await disconnectWhatsApp(userId)
            socket.emit('disconnected', null)
        })
    
        socket.on('disconnect', () => {
          console.log('Cliente desconectado');
        });
      });
}
