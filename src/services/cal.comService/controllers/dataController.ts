import Booking from "models/Booking.js"
import { transformDateTime, transformPhone } from "../../../utils/dataUtils.js"

export const handle = {
    bookingData: async (rawData: any)=>{
        try {
            const data: any = {}
            data.trigger = rawData.triggerEvent
            data.status = rawData.payload.status
            data.id = rawData.payload.uid
            data.page = `https://cal.com/booking/${rawData.payload.uid}`
            data.agency = rawData.payload.responses.agencia.value
            data.booker = {
                name: rawData.payload.responses.name.value,
                whatsapp: transformPhone(rawData.payload.responses.whatsapp.value)
            }
            data.broker = {
                name: rawData.payload.responses.corretor.value,
                whatsapp: transformPhone(rawData.payload.responses.whatsappCorretor.value),
                accompany: rawData.payload.responses.corretorAcompanha.value
            }
            data.property = {
                id: rawData.payload.responses.imovel.value,
                address: rawData.payload.location,
                neighborhood: rawData.payload.responses.bairro.value
            }
            data.services = rawData.payload.responses.servico.value
            data.schedule = {
                start: transformDateTime(rawData.payload.startTime),
                end: transformDateTime(rawData.payload.endTime).hour,
            }
            if(rawData.payload.responses.notes.value){
                data.notes = `Observações: ${rawData.payload.responses.notes.value}`
            }
            if (rawData.triggerEvent == 'BOOKING_REJECTED' && rawData.payload.rejectionReason){
                data.rejectedReason = `Motivo: ${rawData.payload.rejectionReason}`
            }
            if (rawData.triggerEvent == 'BOOKING_CANCELLED' && rawData.payload.cancellationReason){
                data.cancelledReason = `Motivo: ${rawData.payload.cancellationReason}`
            }
            if (rawData.triggerEvent == 'BOOKING_RESCHEDULE' && rawData.payload.responses.rescheduleReason.value){
                data.rescheduleReason = `Motivo: ${rawData.payload.responses.rescheduleReason.value}`
            }
            if (rawData.triggerEvent == 'BOOKING_REQUESTED' && rawData.payload.rescheduleId){
                data.trigger = 'BOOKING_RESCHEDULE'
            }
            if(data.trigger == 'BOOKING_REQUESTED'){
                try {
                    const newBooking = new Booking(data)
                    await newBooking.save()   
                    console.log(`Dados salvos no banco de dados: ${newBooking}`)
                } catch (error) {
                    console.log('Erro ao salvar os dados:', error)
                    throw error
                }
            } else {
                try {
                    await Booking.replaceOne({id: data.id}, data)
                } catch (error) {
                    console.log('Erro ao salvar os dados:', error)
                    throw error
                }
            }
            return data
        } catch (error: any) {
            console.log('Erro no tratamento dos dados:', error)
            throw error
        }
    }   
}