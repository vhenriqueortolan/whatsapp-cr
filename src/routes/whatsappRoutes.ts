import { Router } from 'express';
import { connectToWhatsApp, instances } from '../services/whatsappService';
import { disconnectWhatsApp, sendMessage } from 'utils/whatsappUtils';
import { getSessionFromDB } from 'utils/dbUtils';

const router = Router();

router.post('/test/:userId', async (req:any, res: any)=>{
    const {to, message} = req.body
    const { userId } = req.params
    let sock = instances.get(userId);
    if(!sock){
        console.log('Nenhuma instancia encontrada')
        sock = await connectToWhatsApp(userId)
        if(!sock){
            console.log('Não foi possível criar a instância')
            return res.status(500).json({ message: `Nenhuma sessão ativa para o usuário: ${userId}`});
        }
    }
    try {
        await sendMessage(sock, to, message)
    } catch (error: any) {
        console.error('Erro ao verificar ou iniciar sessão:', error);
        res.status(500).json({ message: 'Erro ao verificar ou iniciar sessão', error: error.message });
    }
})

router.get('/session/:userId', async (req: any, res: any)=>{
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: 'O userId é obrigatório' });
    }
    try {
        // Verifica se o usuário já tem uma sessão no banco de dados
        const sock = await instances.get(userId.toString());
    if(sock){
       return res.status(200).json({ message: `Sessão ativa para o usuário: ${userId}`});
    } else {
        // Caso não tenha sessão, inicia o processo de autenticação (gera o QR Code)
        await connectToWhatsApp(userId);
        return res.status(200).json({ message: 'Sessão não encontrada, QR Code gerado para autenticação' });
    }
    } catch (error: any) {
        console.error('Erro ao verificar ou iniciar sessão:', error);
        res.status(500).json({ message: 'Erro ao verificar ou iniciar sessão', error: error.message });
    }
})

// Rota para enviar mensagem
router.post('/:userId/send-message', async (req: any, res: any) => {
    const userId = req.params
    const sock = await instances.get(userId.toString());
    if(!sock){
       return res.status(500).json({ message: `Nenhuma sessão ativa para o usuário: ${userId}`});
    }
    const { to, message } = req.body;
    if (!to || !message) {
        return res.status(400).json({ message: 'Phone number and message are required.' });
    }
    try {
        await sendMessage(sock, to, message); // Enviar mensagem
        res.status(200).json({ message: 'Mensagem enviada com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao enviar a mensagem.', error: error });
    }
});

router.delete('/session/delete/:userId', async(req: any, res: any)=>{
    const {userId} = req.params
    try {
        await disconnectWhatsApp(userId)
        res.status(200).json({ message: 'Mensagem enviada com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao enviar a mensagem.', error: error });
    }
})

export default router;
