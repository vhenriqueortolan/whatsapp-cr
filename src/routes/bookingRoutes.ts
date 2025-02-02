import express from 'express';
import { notification, defineBookingStatus } from '../services/cal.comService/controllers/bookingController.js' 
import { handle } from '../services/cal.comService/controllers/dataController.js';
import { getAllBookings } from 'utils/dbUtils.js';

const router = express.Router();

router.post('/notification/:userId', async (req, res) =>{
    const rawData = req.body
    const {userId} = req.params
    try {
        const data = await handle.bookingData(rawData)
        console.log({...data})
        // const sendPhotographer = await notification.toPhotographer(data, userId)
        // const sendBookers = await notification.toBroker(data, userId)
        res.status(200).json({});
        // ...sendBookers, ...sendPhotographer
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

router.get('/list', async (req, res) => {
    try {
        const allBookings = await getAllBookings()
        if(allBookings){
            res.status(200).json({data: allBookings})
        }    
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
})

export default router