import Booking from "../../../models/Booking.js"
import { transformDateTime, transformPhone } from "../../../utils/dataUtils.js"

export const handle = {
    bookingData: async (rawData: any)=>{
        const data: any = {}
        try {
            data.id = rawData.payload.uid
            if (rawData.triggerEvent == 'BOOKING_REQUESTED' && rawData.payload.rescheduleUid){
                data.trigger = 'BOOKING_RESCHEDULED'
            } else {
                data.trigger = rawData.triggerEvent
            }
            data.status = rawData.payload.status
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
            if (rawData.triggerEvent == 'BOOKING_RESCHEDULED' && rawData.payload.responses.rescheduleReason.value){
                data.rescheduleReason = `Motivo: ${rawData.payload.responses.rescheduleReason.value}`
            }
        } catch (error: any) {
            console.log('Erro no tratamento dos dados:', error)
            throw error
        }
        try {
            if(data.trigger === 'BOOKING_RESCHEDULED'){
                await Booking.findOneAndReplace({'id': rawData.payload.rescheduleUid}, data)
            }
            if(data.trigger === 'BOOKING_REQUESTED'){
                const newBooking = new Booking(data)
                await newBooking.save()   
            } else {
                const isBooking = await Booking.find({'id': data.id})
                if(isBooking.length === 0){
                    const newBooking = new Booking(data)
                    await newBooking.save()   
                } else {
                    await Booking.replaceOne({id: data.id}, data)
                }
            }
            console.log(`Dados salvos no banco de dados`)
            return data
        } catch (error) {
            console.log('Erro ao salvar no banco de dados:', error)
            throw error
        }
    }
}
