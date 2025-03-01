import { findAndUpdateWhatsappId, findOngoingBookings, findPendingBookings } from "../db/dbUtils.js"

interface CallContent{
    msg: string,
    whatsappId: string
}

interface Booking{
    status: string,
    id: string,
    page: string,
    schedule: {
        start: {hour: string},
        end: string,
    }
    property: { 
        id: string,
        address: string,
        neighborhood: string,
    }
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
                    const date = new Intl.DateTimeFormat('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        timeZone: 'America/Sao_Paulo' // Garante que a data esteja na zona correta
                      }).format(new Date());
                    const bookings = await findOngoingBookings(date)
                    if(bookings.length === 0){
                        resolve('Hmmm... Vi aqui e hoje não tem nenhum agendamento até agora')
                        return
                    }
                    let text = `Aqui estão os agendamentos que encontrei para hoje:`
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
                    const bookings = await findOngoingBookings(date)
                    if(bookings.length === 0){
                        resolve('Hmmm... Vi aqui e hoje não tem nenhum agendamento até agora')
                        return
                    }
                    let text = `Aqui estão os agendamentos que encontrei para o dia ${date}`
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
        call: '#pendente',
        action: async (content?: CallContent): Promise<string> => {
            return new Promise(async(resolve, reject)=>{
                await findPendingBookings()
                .then((bookings: any)=>{
                    let text = `Aqui estão os agendamentos pendentes:`
                    bookings.forEach((booking: any) => {
                        text += texts.pendingList(booking) 
                    });
                    resolve(text)
                })
                .catch((text)=>{
                    reject(text)
                })
            })
        }
    }

] as const

const texts = {
    bookingList:(booking: Booking)=> `

${booking.status === 'PENDING' ? '*PENDENTE*' : ''}
Imóvel: ${booking.property.id}
Endereço: *${booking.property.address}, ${booking.property.neighborhood}*
Horário: *${booking.schedule.start.hour} - ${booking.schedule.end}*
Serviços: ${booking.services}
Corretor: ${booking.broker.name} - WhatsApp: ${booking.broker.whatsapp.slice(2)}
${booking.notes ? `${booking.notes}` : ''}`,

    pendingList: (booking: Booking)=>`

Imóvel: ${booking.property.id}
Endereço: *${booking.property.address}, ${booking.property.neighborhood}*
Horário: *${booking.schedule.start.hour} - ${booking.schedule.end}*
Serviços: ${booking.services}
Corretor: ${booking.broker.name} - WhatsApp: ${booking.broker.whatsapp.slice(2)}
> Para *confirmar* o agendamento clique aqui https://whatsapp-cr.onrender.com/booking/${booking.id}/confirm
> Para *reagendar* clique aqui ${booking.page}
> Para *recusar* clique aqui https://whatsapp-cr.onrender.com/booking/${booking.id}/decline
========================`

}

export {responses}