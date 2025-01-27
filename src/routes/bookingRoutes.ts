import express from 'express';
import { notification, defineBookingStatus } from '../services/cal.comService/handlers/bookingHandle.js' 
import { handle } from '../services/cal.comService/handlers/dataHandle.js';
import { delayFunction } from 'utils/dataUtils.js';

const router = express.Router();

router.post('/notification/:userId', async (req, res) =>{
    const rawData = req.body
    console.log({...rawData})
    const {userId} = req.params
    try {
        const data = handle.bookingData(rawData)
        console.log({...data})
        let sendBrokers: any
        let sendPhotographer: any
        // setTimeout(async () => {
        //     sendBrokers = await notification.toBroker(data, userId)
        // }, 5000);
        sendPhotographer = await notification.toPhotographer(data, userId)
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