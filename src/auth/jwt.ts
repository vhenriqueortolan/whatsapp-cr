import jsonwebtoken from 'jsonwebtoken'
import dotenv from 'dotenv'
import { Types } from 'mongoose'

dotenv.config()
const secret = process.env.SECRET as string

export async function generateToken(userId: Types.ObjectId, role: string, name: string, username: string){
    const payload = {
        userId,
        role,
        name,
        username
    }
    const token = jsonwebtoken.sign({...payload}, secret, {expiresIn: '7d'})
    return token
}

export const auth = (req: any, res: any, next: any) => {
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Pega o token do cabeçalho

    // Se o token não for encontrado, retorna um erro
    if (!token) {
        return res.status(403).json({ error: 'Token não fornecido' });
    }

    // Verificar se o token é válido
    jsonwebtoken.verify(token, secret, (err: any, user: any) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }
        
        // Colocar as informações do usuário no req.user
        req.user = user;
        next(); // Chama o próximo middleware ou a rota
    });
};