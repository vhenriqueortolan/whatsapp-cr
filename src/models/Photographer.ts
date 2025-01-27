import mongoose from "mongoose";

const photographerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true
    }
)

// Criar o modelo
const Photographer = mongoose.model('Photographer', photographerSchema);

export default Photographer