import express from 'express';
import { notification, defineBookingStatus } from '../services/cal.com/controllers/bookingController.js' 
import { handle } from '../services/cal.com/controllers/dataController.js';
import { findOngoingBookings, startOrEndBooking } from '../services/db/dbUtils.js';

const router = express.Router();

router.post('/notification/:userId', async (req, res) =>{
    console.log('Requisição para nova notificação de agendamento')
    const rawData = req.body
    const {userId} = req.params
    try {
        const data = await handle.bookingData(rawData)
        console.log({...data})
        const sendPhotographer = await notification.toPhotographer(data, userId)
        const sendBookers = await notification.toBroker(data, userId)
        res.status(200).json({ ...sendBookers, ...sendPhotographer}); //
    } catch (error: any) {
        console.log({ message: 'Erro ao enviar mensagem', error: error.message })
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
        const allBookings = await findOngoingBookings()
        if(allBookings){
            console.log('Listagem de agendamentos consultada')
            res.status(200).json({allBookings})
        }    
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
})

router.get('/notification/:userId/:bookingId/:startOrEnd', async (req, res) => {
    const {userId, bookingId, startOrEnd} = req.params
    const {photo, video} = req.query
    const queryParams = {
        photo: photo === 'true',
        video: video === 'true'
    };
    try {
        const data = await startOrEndBooking(bookingId, startOrEnd, queryParams.photo, queryParams.video)
        const send = await notification.serviceStatus(userId, data, startOrEnd)
        res.status(200).json({ message: 'Mensagem enviada com sucesso', messageContent: send });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Erro ao enviar mensagem', error: error });
    }
})

export default router
