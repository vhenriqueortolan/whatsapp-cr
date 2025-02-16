import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

export const connectDB = async () => {
    try {        
        await mongoose.connect(process.env.DB_URI as string, {
            serverApi: {
                version: '1', 
                strict: true, 
                deprecationErrors: true 
            } 
        });

        console.log('Conectado ao MongoDB com sucesso!');
    } catch (error: any) {
        console.error('Erro ao conectar ao MongoDB:', error.message);
        process.exit(1); // Encerra a aplicação se der erro
    }
};
