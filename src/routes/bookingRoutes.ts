import express from 'express';
import bcrypt from 'bcrypt'
import { notification, defineBookingStatus } from '../services/cal.comService/controllers/bookingController.js' 
import { handle } from '../services/cal.comService/controllers/dataController.js';
import { getAllBookings } from '../utils/dbUtils.js';
import Photographer from '../models/Photographer.js';
import { generateToken } from '../auth/jwt.js';

const router = express.Router();

router.post('/notification/:userId', async (req, res) =>{
    const rawData = req.body
    const {userId} = req.params
    try {
        const data = await handle.bookingData(rawData)
        console.log({...data})
        const sendPhotographer = await notification.toPhotographer(data, userId)
        const sendBookers = await notification.toBroker(data, userId)
        res.status(200).json({...sendBookers, ...sendPhotographer});
        // 
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
            console.log('Listagem de agendamentos consultada')
            res.status(200).json({allBookings})
        }    
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
})

export default router

router.post('/login', async(req: any, res: any)=>{
    const { username, password } = req.body
    if(!username || !password){
      return res.status(403).json({status: 'failed', error: 'Username ou Password não foram fornecidos'})
    }
    try {
        const user: any = await Photographer.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Senha inválida' });
        }
        const token = await generateToken(user._id, user.role, user.name, user.username);
        res.json({token, message: 'Login bem-sucedido'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
})