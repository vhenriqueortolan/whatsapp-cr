import { findAndUpdateWhatsappId, findBookingByDate } from "../../utils/dbUtils.js"

interface CallContent{
    msg: string,
    whatsappId: string
}

interface Booking{
    schedule: {
        start: {hour: string},
        end: string,
    }
    property: string,
    address: string,
    neighborhood: string,
    services: string,
    broker: { name: string, whatsapp: string},
    notes: string
}

const responses = [
    {
        call: '#salvargrupo', 
        action: async (content: CallContent): Promise<string> =>{
            const {msg, whatsappId} = content
            const username = msg.split(' ')[1]
            return new Promise<string>(async (resolve, reject)=>{
                try {
                    await findAndUpdateWhatsappId(username, whatsappId)
                    resolve(`O grupo foi salvo para o usuário ${username}`)
                } catch (error) {
                    reject(`Ops! não consegui salvar o grupo, encontrei o erro: ${error}`)
                }
            })
        }
    },
    {
        call: '#hoje',
        action: async (content: CallContent): Promise<string> =>{
            return new Promise<string>(async (resolve, reject)=>{
                try {
                    const date = new Intl.DateTimeFormat('pt-BR')
                    .format(new Date(
                    new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })));
                    const bookings = await findBookingByDate(date)
                    if(bookings.length === 0){
                        resolve('Hmmm... Vi aqui e hoje não tem nenhum agendamento até agora')
                        return
                    }
                    let text = `Aqui estão os agendamentos que encontrei para o dia hoje:`
                    bookings.forEach((booking: any) => {
                        text += texts.bookingList(booking) 
                    });
                    resolve(text)
                } catch (error) {
                    reject(`Ops! não consegui acessar os agendamentos, encontrei o erro: ${error}`)
                }
            })
        }
    },
    {
        call: '#data',
        action: async(content: CallContent): Promise<string> =>{
            const {msg} = content
            const date = msg.split(' ')[1]

            return new Promise(async (resolve, reject)=>{
                try {
                    const bookings = await findBookingByDate(date)
                    if(bookings.length === 0){
                        resolve('Hmmm... Vi aqui e hoje não tem nenhum agendamento até agora')
                        return
                    }
                    let text = `Aqui estão os agendamentos que encontrei para o dia hoje:`
                    bookings.forEach((booking: any) => {
                        text += texts.bookingList(booking) 
                    });
                    resolve(text)
                } catch (error) {
                    reject(`Ops! não consegui acessar os agendamentos, encontrei o erro: ${error}`)
                }
            })
        }
    }

] as const

const texts = {
    bookingList:(booking: Booking)=> `

Endereço: *${booking.address}, ${booking.neighborhood}*
Horário: *${booking.start.hour} - ${booking.end}*
Serviços: ${booking.services}
Imóvel: ${booking.property}
Corretor: ${booking.broker.name} - WhatsApp: ${booking.broker.whatsapp.slice(2)}
${booking.notes ? `${booking.notes}` : ''}`

}

export {responses}