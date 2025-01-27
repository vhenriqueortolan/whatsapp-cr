import { Router } from 'express';
import User from 'models/User';
import bcrypt from 'bcrypt'
import { generateToken } from 'auth/jwt';

const router = Router();

// Rota para registrar usuário
router.post('/login', async (req: any, res: any) => {
    const { username, password } = req.body
    if(!username || !password){
      return res.status(403).json({status: 'failed', error: 'Username ou Password não foram fornecidos'})
    }
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Senha inválida' });
        }
        const token = await generateToken(user._id);
        res.json({ message: 'Login bem-sucedido', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro no login' });
    }
});

export default router;
