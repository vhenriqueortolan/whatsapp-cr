import { Router } from 'express';
import { sock } from '../services/whatsappService';
import { sendMessage } from 'utils/messageUtils';

const router = Router();

// Rota para enviar mensagem
router.post('/send-message', async (req: any, res: any) => {
    if(!sock){
        res.status(500).json({ message: 'Whatsapp indisponível no momento'});
    }
    
    const { to, message } = req.body;

    if (!to || !message) {
    return res.status(400).json({ message: 'Phone number and message are required.' });
    }

    try {
    await sendMessage(to, message); // Enviar mensagem
    res.status(200).json({ message: 'Mensagem enviada com sucesso' });
    } catch (error) {
    res.status(500).json({ message: 'Erro ao enviar a mensagem.', error: error });
    }
});

export default router;
