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
        }
    },
    {
        timestamps: true
    }
)

// Criar o modelo
const Photographer = mongoose.model('Photographer', photographerSchema);

export default Photographer