import { booking, photographer } from '../messages/bookingMessages.js';
import dotenv from 'dotenv'
import axios from "axios";
import { getGroupMetadata, getMessageStatus, sendMessage } from "../../../utils/whatsappUtils.js";
import { instances } from "../../whatsappService.js";
import Photographer from '../../../models/Photographer.js';

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
            if(data.bookingStatus == 'BOOKING_REQUESTED'){
                message = booking.requestedMessage(data)
            }
            if(data.bookingStatus == 'BOOKING_REJECTED'){
                message = booking.rejectedMessage(data)
            }
            if(data.bookingStatus == 'BOOKING_CREATED'){
                message = booking.createdMessage(data)
            }
            if(data.bookingStatus == 'BOOKING_RESCHEDULE'){
                message = booking.rescheduleMessage(data)
            }
            if(data.bookingStatus == 'BOOKING_CANCELLED'){
                message = booking.cancelledMessage(data)
            }
            const broker = await sendMessage(sock, data.broker.whatsapp, message)
            const agent = await sendMessage(sock, data.agent.whatsapp, message)
            return {broker, agent}
        } catch (error) {
            console.error('Erro no envio da mensagem:', error);
            throw error
        }
},
    toPhotographer: async (data: any, userId: any)=>{
        const sock = await instances.get(userId)
        const [photo] = await Photographer.find()
        if (!sock){
            const err = {status: 'failed', message: 'Serviço Whatsapp não está conectado'}
            throw err
        }
        let message = ""
        try {
            if(data.bookingStatus == 'BOOKING_REQUESTED'){
                message = photographer.requestedMessage(data)
            }
            if(data.bookingStatus == 'BOOKING_REJECTED'){
                message = photographer.rejectedMessage(data)
            }
            if(data.bookingStatus == 'BOOKING_CREATED'){
                message = photographer.createdMessage(data)
            }
            if(data.bookingStatus == 'BOOKING_RESCHEDULE'){
                message = photographer.rescheduleMessage(data)
            }
            if(data.bookingStatus == 'BOOKING_CANCELLED'){
                message = photographer.cancelledMessage(data)
            }
            if(!photo.whatsappId){
                const err = 'Grupo de Fotos não definido'
                throw new Error(err)
            }
            await getGroupMetadata(sock, photo.whatsappId)
            const result: any = await getMessageStatus(sock, data.groupJid, message)
            return {status: result.status, messageId: result.messageId}
        } catch (error) {
            console.error('Erro no envio da mensagem:', error);
            throw error
        }
    }
}


export async function defineBookingStatus(booking: any, status: any){
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
        options.data = '{"reason":"Recusado pelo fotógrafo"}'
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