import express from 'express';
import whatsappRoutes from 'routes/whatsappRoutes';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
import { connectToWhatsApp } from 'services/whatsappService';

dotenv.config()

const app = express();

app.use(bodyParser.json())

// Rotas WhatsApp
app.use('/whatsapp', whatsappRoutes)

// Inicia o WhatsApp
connectToWhatsApp()
  .then(() => {
    console.log('Whatsapp conectado com sucesso!');
  })
  .catch((error) => {
    console.error('Erro ao iniciar o whatsapp:', error);
  });

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
