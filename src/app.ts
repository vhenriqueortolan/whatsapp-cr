import express from 'express';
import http from 'http'
import { auth } from './auth/jwt.js';
import whatsappRoutes from './routes/whatsappRoutes.js';
import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import ping from './routes/ping.js'
import bodyParser from 'body-parser';
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './services/db/dbService.js';
import { initializeSessions } from './services/db/dbUtils.js';
import { Server } from 'socket.io';
import initSocket from './services/socketService.js';

dotenv.config()

const app = express();
// Cria o servidor HTTP a partir do Express
const httpServer = http.createServer(app);

// Inicializa o Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: '*', // Permite conexões de qualquer origem. Ajuste conforme necessário.
  },
});

app.use(cors())
app.use(bodyParser.json())

// Rotas WhatsApp
app.use('/', authRoutes)
app.use('/whatsapp', whatsappRoutes)
app.use('/user', auth, userRoutes)
app.use('/booking', bookingRoutes)
app.use('/', ping)

// Conecta Banco de Dados
await connectDB()

await initSocket(io)

// Inicia o servidor
initializeSessions().then(() => {
  httpServer.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
  });
}).catch(err => {
  console.error('Erro ao inicializar o servidor:', err);
});
