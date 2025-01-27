import express from 'express';
import { notification, defineBookingStatus } from '../services/cal.comService/handlers/bookingHandle' 
import { handle } from '../services/cal.comService/handlers/dataHandle';

const router = express.Router();

router.post('/notification', async (req, res) =>{
    const rawData = req.body
    try {
        const data = handle.bookingData(rawData)
        const sendBrokers = await notification.toBroker(data)
        const sendPhotographer = await notification.toPhotographer(data)
        res.status(200).json({...sendBrokers, ...sendPhotographer});
    } catch (error: any) {
        res.status(500).json({ message: 'Erro ao enviar mensagem', error: error.message });
    }
})

router.get('/:bookingId/:status', async (req, res) => {
    const {bookingId, status} = req.params
    try {
        const send = await defineBookingStatus(bookingId, status)
        res.status(200).json({ message: 'Mensagem enviada com sucesso', messageContent: send });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao enviar mensagem', error: error });
    }
})

export default router