import { booking, photographer } from '../messages/bookingMessages.js';
import dotenv from 'dotenv'
import axios from "axios";
import { getGroupMetadata, getMessageStatus, sendMessage } from "../../../services/whatsapp/whatsappUtils.js";
import { instances } from "../../whatsapp/whatsappService.js";
import User from '../../../models/User.js';

dotenv.config();

export const notification = {
    toBroker: async (data: any, userId: any)=>{
        const sock = await instances.get(userId)
        if (!sock){
            const err = {status: 'failed', message: 'Serviço Whatsapp não está conectado'}
            throw err
        }
        let message = ""
        try {
            if(data.trigger == 'BOOKING_REQUESTED'){
                message = booking.requestedMessage(data)
            }
            if(data.trigger == 'BOOKING_REJECTED'){
                message = booking.rejectedMessage(data)
            }
            if(data.trigger == 'BOOKING_CREATED'){
                message = booking.createdMessage(data)
            }
            if(data.trigger == 'BOOKING_RESCHEDULE'){
                message = booking.rescheduleMessage(data)
            }
            if(data.trigger == 'BOOKING_CANCELLED'){
                message = booking.cancelledMessage(data)
            }
            const broker = await sendMessage(sock, data.broker.whatsapp, message)
            const agent = await sendMessage(sock, data.booker.whatsapp, message)
            return {broker, agent}
        } catch (error) {
            console.error('Erro no envio da mensagem:', error);
            throw error
        }
},
    toPhotographer: async (data: any, userId: any)=>{
        const sock = await instances.get(userId)
        const photo = await User.findOne({'role': 'photo'})
        if(!photo){
            return 
        }
        data.photographer = {
            name: photo.name,
        }
        if (!sock){
            const err = {status: 'failed', message: 'Serviço Whatsapp não está conectado'}
            throw err
        }
        let message = ""
        try {
            if(data.trigger == 'BOOKING_REQUESTED'){
                message = photographer.requestedMessage(data)
            }
            if(data.trigger == 'BOOKING_REJECTED'){
                message = photographer.rejectedMessage(data)
            }
            if(data.trigger == 'BOOKING_CREATED'){
                message = photographer.createdMessage(data)
            }
            if(data.trigger == 'BOOKING_RESCHEDULE'){
                message = photographer.rescheduleMessage(data)
            }
            if(data.trigger == 'BOOKING_CANCELLED'){
                message = photographer.cancelledMessage(data)
            }
            if(!photo.whatsappId){
                const err = 'Grupo de Fotos não definido'
                throw new Error(err)
            }
            await getGroupMetadata(sock, photo.whatsappId)
            const result: any = await getMessageStatus(sock, photo.whatsappId, message)
            return {status: result.status, messageId: result.messageId}
        } catch (error) {
            console.error('Erro no envio da mensagem:', error);
            throw error
        }
    },
    serviceStatus: async (userId: any, data: any, startOrEnd: string)=>{
        try {
            const sock = await instances.get(userId)
            const photo = await User.findOne({'role': 'photo'})
            let message
            if(startOrEnd === 'start'){
                message = booking.start(data)
            }
            if(startOrEnd === 'end'){
                message = booking.end(data)
            }
            if (sock && photo){
                const broker = await sendMessage(sock, data.broker.whatsapp, message as string)
                const agent = await sendMessage(sock, data.booker.whatsapp, message as string)
                await getGroupMetadata(sock, photo.whatsappId)
                const result: any = await getMessageStatus(sock, photo.whatsappId, message as string)
                return {broker, agent, photographer: {status: result.status, messageId: result.messageId}}
            } else {
                const err = 'Não foi possível enviar a mensagem'
                throw new Error(err) 
            }
        } catch (error) {
            throw error
        }
    }
}


export async function defineBookingStatus(booking: any, status: any, reason?: any){
    const options: any = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.TOKEN_CAL}`,
          'cal-api-version': '2024-08-13',
          'Content-Type': 'application/json'
        },
      };
    if(status == 'confirm'){
       await axios(`https://api.cal.com/v2/bookings/${booking}/confirm`, options)
        .then(response => {
            console.log(response.status);
          })
    }
    if(status == 'decline'){
        options.data = {reason}
        await axios(`https://api.cal.com/v2/bookings/${booking}/decline`, options)
        .then(response => {
            console.log(response.data);
     })
    }
    if(status == 'cancel'){
        await axios(`https://api.cal.com/v2/bookings/${booking}/cancel`, options)
        .then(response => {
            console.log(response.data);
     })
    }
}