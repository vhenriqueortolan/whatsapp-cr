import { Router } from 'express';
import bcrypt from 'bcrypt'
import {listUsers, registerUser, updateUser, deleteUser} from '../services/db/dbUtils.js';

const router = Router();

// Rota para registrar usuário
router.post('/register', async (req: any, res: any) => {
    const {username, password, email, name, role, whatsappId} = req.body
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await registerUser(username, hashedPassword, email, name, role, whatsappId)
        res.status(200).json({status: 'success', message: 'Usuário criado com sucesso'})
    } catch (error: any) {
        console.log(error)
        res.status(500).json({status: 'failed', error})
    }
});

router.get('/list', async (req: any, res: any) => {
    try {
        const users = await listUsers()
        res.status(200).json([...users])
    } catch (error: any) {
        console.log(error)
        res.status(500).json({status: 'failed', error})
    }
});

router.put('/update/:userId', async (req: any, res: any) => {
    const userId = req.params.userId
    const {username, password, email, name, role, whatsappId} = req.body
    try {
        const update = await updateUser(userId, username, password, email, name, role, whatsappId)
        if (!update.status){
           return res.status(404).json({status: 'failed', error: update.message})
        }
        res.status(200).json({status: update.status, message: update.message})
    } catch (error: any) {
        console.log(error)
        res.status(500).json({status: 'failed', error})
    }
});

router.delete('/delete/:userId', async (req: any, res: any) => {
    const userId = req.params.userId
    try {
        const deleted = await deleteUser(userId)
        if (!deleted.status){
            return res.status(404).json({status: 'failed', error: deleted.message})
         }
         res.status(200).json({status: deleted.status, message: deleted.message})
     } catch (error: any) {
         console.log(error)
         res.status(500).json({status: 'failed', error})
     }
});

export default router;
