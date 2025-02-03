import { Router } from 'express';
import { listPhotographers, registerPhotographer, updatePhotographer, deletePhotographer } from '../utils/dbUtils.js';
import bcrypt from 'bcrypt'

const router = Router();

// Rota para registrar usuário
router.post('/register', async (req: any, res: any) => {
    const {name, whatsappId, username, role, password} = req.body
    console.log({name, whatsappId})
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await registerPhotographer(name, username, hashedPassword, role, whatsappId)
        res.status(200).json({status: 'success', message: 'Fotógrafo criado com sucesso'})
    } catch (error: any) {
        res.status(500).json({status: 'failed', message: error.message})
    }
});

router.get('/list', async (req: any, res: any) => {
    try {
        const photographers = await listPhotographers()
        res.status(200).json([...photographers])
    } catch (error: any) {
        console.log(error)
        res.status(500).json({status: 'failed', error: error.message})
    }
});

router.put('/update/:photographerId', async (req: any, res: any) => {
    const photographerId = req.params.photographerId
    const {name, whatsappId, username, password} = req.body
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const update = await updatePhotographer(photographerId, name, whatsappId, username, hashedPassword)
        if (!update.status){
           return res.status(404).json({status: 'failed', error: update.message})
        }
        res.status(200).json({status: update.status, message: update.message})
    } catch (error: any) {
        console.log(error)
        res.status(500).json({status: 'failed', error: error.message})
    }
});

router.delete('/delete/:photographerId', async (req: any, res: any) => {
    const photographerId = req.params.photographerId
    try {
        const deleted = await deletePhotographer(photographerId)
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
