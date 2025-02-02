import { Router } from 'express';
import bcrypt from 'bcrypt'
import {listUsers, registerUser, updateUser, deleteUser} from '../utils/dbUtils.js';

const router = Router();

// Rota para registrar usuário
router.post('/register', async (req: any, res: any) => {
    const {username, password, email, name, role} = req.body
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await registerUser(username, hashedPassword, email, name, role)
        res.status(200).json({status: 'success', message: 'Usuário criado com sucesso'})
    } catch (error: any) {
        res.status(500).json({status: 'failed', message: error.message})
    }
});

router.get('/list', async (req: any, res: any) => {
    try {
        const users = await listUsers()
        res.status(200).json([...users])
    } catch (error: any) {
        console.log(error)
        res.status(500).json({status: 'failed', error: error.message})
    }
});

router.put('/update/:userId', async (req: any, res: any) => {
    const userId = req.params.userId
    const {username, password, email, name, role} = req.body
    try {
        const update = await updateUser(userId, username, password, email, name, role)
        if (!update.status){
           return res.status(404).json({status: 'failed', error: update.message})
        }
        res.status(200).json({status: update.status, message: update.message})
    } catch (error: any) {
        console.log(error)
        res.status(500).json({status: 'failed', error: error.message})
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
         res.status(500).json({status: 'failed', error: error.message})
     }
});

export default router;
