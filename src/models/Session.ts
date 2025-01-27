import mongoose from "mongoose";

// Definir o schema da sessão
const sessionSchema = new mongoose.Schema(
    {
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Referência ao modelo de usuário
        required: true 
    },
    sessionData: {
        type: String,
        required: true,
    },
    keys: {
        type: String,
        required: true,
    },
    },
    {
        timestamps: true
    }
);

// Criar o modelo
const Session = mongoose.model('Session', sessionSchema);

export default Session