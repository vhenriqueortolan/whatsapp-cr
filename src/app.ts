import express from 'express';
import { auth } from './auth/jwt.js';
import whatsappRoutes from './routes/whatsappRoutes.js';
import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'
import photographerRoutes from './routes/photographerRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
import { connectDB } from './services/dbService.js';
import { initializeSessions } from './utils/dbUtils.js';

dotenv.config()

const app = express();

app.use(bodyParser.json())

// Rotas WhatsApp
app.use('/', authRoutes)
app.use('/whatsapp', whatsappRoutes)
app.use('/user', auth, userRoutes)
app.use('/photographer', auth, photographerRoutes)
app.use('/booking', bookingRoutes)

// Conecta Banco de Dados
await connectDB()

// Inicia o servidor
initializeSessions().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
  });
}).catch(err => {
  console.error('Erro ao inicializar o servidor:', err);
});