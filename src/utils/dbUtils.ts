import User from "../models/User.js";
import Session from "../models/Session.js";
import { Types } from 'mongoose'
import { BufferJSON } from "@whiskeysockets/baileys";
import { connectToWhatsApp } from "../services/whatsappService.js";
import Booking from "../models/Booking.js";


export async function registerUser(username: string, password: string, email: string, name: string, role: string, whatsappId?: string){
    try {
        const newUser = new User({username, password, email, name, role, whatsappId})
        await newUser.save()
    } catch (error: any) {
        throw error
    } 
}

export async function listUsers(){
    try {
        const users = await User.find().select('username email name role whatsappId')
        if (!users){
            throw new Error('Nenhum usuário encontrado')
        }
        return users
    } catch (error: any) {
        throw error
    }
}

export async function updateUser(userId: Types.ObjectId, username?: string, password?: string, email?: string, name?: string, role?: string, whatsappId?: string){
    try {
        const user = await User.findById(userId)
        if (!user){
            return {status: null, message: 'Nenhum usuário encontrado'}
        }
        user.username = username || user.username
        user.password = password || user.password
        user.email = email || user.email
        user.name = name || user.name
        user.role = role || user.role
        user.whatsappId = whatsappId || user.whatsappId

        await user.save()
        return {status: 'success', message: 'Usuário atualizado com sucesso'}

    } catch (error: any) {
        throw error
    }
}

export async function findAndUpdateWhatsappId(username: string, whatsappId: string){
    try {
        const user = await User.findOne({username})
        if (!user){
            return null
        }
        user.whatsappId = whatsappId 

        await user.save()
        return {status: 'success', message: 'Usuário atualizado com sucesso'}

    } catch (error: any) {
        throw error
    }
}

export async function deleteUser(userId: Types.ObjectId){
    try {
        const user = await User.findById(userId)
        if (!user){
            return {status: null, message: 'Nenhum usuário encontrado'}
        }
        await User.findByIdAndDelete(userId)
        return {status: 'success', message: 'Usuário deletado com sucesso'}
    } catch (error: any) {
        throw error
    }
}

// Recupera a sessão do banco de dados
export async function getSessionFromDB(userId: Types.ObjectId) {
    const session = await Session.findOne({ userId });
    if (session) {
        return {
            creds: JSON.parse(session.sessionData, BufferJSON.reviver),
            keys: JSON.parse(session.keys, BufferJSON.reviver),
        };
    }
    return null;
}

// Salva ou atualiza a sessão no banco de dados
export async function saveSessionToDB(userId: Types.ObjectId, creds: any, keys: any) {
    await Session.updateOne(
        { userId },
        {
            userId,
            sessionData: JSON.stringify(creds, BufferJSON.replacer),
            keys: JSON.stringify(keys, BufferJSON.replacer),
        },
        { upsert: true } // Cria a sessão se ela não existir
    );
}

async function getAllSessionsFromDB() {
    try {
        // Buscando todas as sessões da coleção de sessões
        const sessions = await Session.find({}).exec();
        return sessions;
    } catch (error) {
        console.error('Erro ao buscar sessões no banco de dados:', error);
        throw new Error('Erro ao recuperar sessões');
    }
}

export async function initializeSessions() {
    try {
        const sessions = await getAllSessionsFromDB();
        if (!sessions[0]){
            console.log('Nenhuma sessão ativa.');
            return 
        }
        // Para cada sessão, chamar a função de conexão
        for (const session of sessions) {
            const { userId } = session;
            await connectToWhatsApp(userId.toString());  // Conecta ao WhatsApp com a função que você já tem
        }
        console.log('Todas as sessões foram carregadas e conectadas!');
    } catch (error) {
        console.error('Erro ao inicializar as sessões:', error);
    }
}

export async function removeSessionFromDB(userId: Types.ObjectId) {
    const session = await Session.findOne({ userId });
    
    if (session) {
        // Remove a sessão do banco de dados
        await Session.findByIdAndDelete(session._id)
        console.log(`Sessão do usuário ${userId} removida do banco de dados.`);
    } else {
        console.log(`Nenhuma sessão encontrada para o usuário ${userId}.`);
    }
}

export async function getAllBookings(){
    try {
        const allBookings = await Booking.find()
        return allBookings
    } catch (error) {
        throw error
    }
}

export async function findBookingByDate(date: string){
    try {
        const bookings = await Booking.find({'schedule.start.day': date})
            .sort({ 'schedule.start.hour': 1 }); // Ordena de forma crescente (1 = ascendente)
            return bookings
    } catch (error) {
        throw error
    }
}