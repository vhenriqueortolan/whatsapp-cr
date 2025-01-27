import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Deve ser armazenado como hash
    email: { type: String, required: true, unique: true },
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' }, // Referência ao modelo de sessão
    admin: { type: Boolean, default: false }, // Define se o usuário é administrador
    createdAt: { type: Date, default: Date.now },
})

const User = mongoose.model('User', userSchema);

export default User