import express from 'express';
import { auth } from 'auth/jwt';
import whatsappRoutes from 'routes/whatsappRoutes';
import userRoutes from 'routes/userRoutes'
import authRoutes from 'routes/authRoutes'
import photographerRoutes from 'routes/photographerRoutes'
import bookingRoutes from 'routes/bookingRoutes'
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
import { connectDB } from 'services/dbService';
import { initializeSessions } from 'utils/dbUtils';

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