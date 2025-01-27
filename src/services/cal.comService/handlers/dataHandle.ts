import { transformDateTime, transformPhone } from "../../../utils/dataUtils.js"

export const handle = {
    bookingData: (rawData: any)=>{
        try {
            const data: any = {}
            data.bookingStatus = rawData.triggerEvent
            data.bookingId = rawData.payload.uid
            data.bookingPage = `https://cal.com/booking/${rawData.payload.uid}`
            data.agency = rawData.payload.responses.agencia.value
            data.agent = {
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
            data.schedule = transformDateTime(rawData.payload.startTime)
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
                data.bookingStatus = 'BOOKING_RESCHEDULE'
                data.schedule = transformDateTime(rawData.payload.rescheduleStartTime)
            }
            return data
        } catch (error: any) {
            console.log('Erro no tratamento dos dados:', error)
            throw new Error(error)
        }
    }
}