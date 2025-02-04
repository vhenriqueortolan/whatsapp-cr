import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true }, // Deve ser armazenado como hash
        email: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' }, // Referência ao modelo de sessão
        role: { type: String, default: false }, // Define se o usuário é administrador
        whatsappId: { type: String, default: false, unique: true }
    },
    {
        timestamps: true
    }
)

const User = mongoose.model('User', userSchema);

export default User