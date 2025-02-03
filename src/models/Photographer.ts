import mongoose from "mongoose";

const photographerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        whatsappId: {
            type: String,
            required: false
        },
        role: {
            type: String,
            required: false
        },
        username: { 
            type: String, 
            required: true, 
            unique: true },
        password: { 
            type: String, 
            required: true }, // Deve ser armazenado como hash
    },
    {
        timestamps: true
    }
)

// Criar o modelo
const Photographer = mongoose.model('Photographer', photographerSchema);

export default Photographer