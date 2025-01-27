export const booking = {
    
    requestedMessage: (data: any) => `Um novo agendamento da agência ${data.agency} com o fotógrafo foi *pré-reservado* para o dia ${data.schedule.day} as ${data.schedule.hour}! Confira os dados:
        
Serviços: ${data.services}
Imóvel: ${data.property.id}
Endereço: ${data.property.address}
    
Corretor responsável: *${data.broker.name}* 
Vai acompanhar: ${data.broker.accompany}
${data?.notes || ''}
        
*Aguarde a confirmação da reserva!*
    
> Para alterar ou cancelar, clique aqui ${data.bookingPage}
> Para agendar uma data para outro imóvel clique aqui https://cal.com/victor-henrique-ortolan-oxokkw/agendar-fotos`,

    rejectedMessage: (data: any)=>`O agendamento de fotos para o imóvel ${data.property.id}, da agência ${data.agency}, no dia ${data.schedule.day} as ${data.schedule.hour} foi *recusado*.

    ${data?.rejectedReason || 'O motivo não foi informado.'}

    > Para agendar uma nova data para esse ou outro imóvel visite https://cal.com/victor-henrique-ortolan-oxokkw/agendar-fotos`,

    createdMessage: (data: any)=> `Oba! Temos ótimas notícias!! O agendamento da agência ${data.agency} com o fotógrafo está *confirmado* para o dia ${data.schedule.day} as ${data.schedule.hour}! Confira os dados:
        
Serviços: ${data.services}
Imóvel: ${data.property.id}
Endereço: ${data.property.address}
    
Corretor responsável: *${data.broker.name}* 
Vai acompanhar: ${data.broker.accompany}
${data?.notes || ''}
        
*Estamos anciosos pra ver o material!*
    
> Para alterar ou cancelar, clique aqui ${data.bookingPage}
> Para agendar uma data para outro imóvel clique aqui https://cal.com/victor-henrique-ortolan-oxokkw/agendar-fotos`,

    rescheduleMessage: (data: any)=>`Hey! Passando para avisar que o agendamento da agência ${data.agency} com o fotógrafo foi *reagendado* para o dia ${data.schedule.day} as ${data.schedule.hour}! Confira os dados:
        
Serviços: ${data.services}
Imóvel: ${data.property.id}
Endereço: ${data.property.address}
    
Corretor responsável *${data.broker.name}* 
Vai acompanhar: ${data.broker.accompany}
${data?.rescheduleReason || 'O motivo do reagendamento não foi informado.'}

*Estamos anciosos pra ver o material!*
    
> Para alterar ou cancelar, clique aqui ${data.bookingPage}
> Para agendar uma data para outro imóvel clique aqui https://cal.com/victor-henrique-ortolan-oxokkw/agendar-fotos`,

    cancelledMessage: (data: any)=> `O agendamento de fotos para o imóvel ${data.property.id}, da agência ${data.agency}, no dia ${data.schedule.day} as ${data.schedule.hour} foi *cancelado*.

 ${data?.cancelledReason || 'O motivo não foi informado.'}

> Para agendar uma nova data para esse ou outro imóvel visite https://cal.com/victor-henrique-ortolan-oxokkw/agendar-fotos`
}

export const photographer = {
    requestedMessage: (data: any)=>`Olá, ${data.photographer.name}!! A agência ${data.agency} solicitou um novo agendamento:
        
Dia: ${data.schedule.day} as ${data.schedule.hour}
Serviços: ${data.services}
        
Endereço: ${data.property.address}
Bairro: ${data.property.neighborhood}
Corretor responsável: ${data.broker.name}
Vai acompanhar: ${data.broker.accompany}
${data?.notes || ''}
        
> Para *confirmar* o agendamento clique aqui https://whatsapp-cr.onrender.com/booking/${data.bookingId}/confirm
> Para *recusar* clique aqui https://whatsapp-cr.onrender.com/booking/${data.bookingId}/decline`,

    rejectedMessage: (data: any)=>`Olá, ${data.photographer.name}!! Você recusou um agendamento com a agência ${data.agency}:

${data?.rejectedReason || 'O motivo não foi informado.'}

Dia: ${data.schedule.day} as ${data.schedule.hour}`,

    createdMessage: (data: any)=>`Olá, ${data.photographer.name}!! Um agendamento com a agência ${data.agency} foi confirmado:
        
Dia: ${data.schedule.day} as ${data.schedule.hour}
Serviços: ${data.services}
        
Endereço: ${data.property.address}
Bairro: ${data.property.neighborhood}
Corretor responsável: ${data.broker.name}
Vai acompanhar: ${data.broker.accompany}
${data?.notes || ''}
        
> Para *cancelar* clique aqui https://whatsapp-cr.onrender.com/booking/${data.bookingId}/cancel`,

    rescheduleMessage: (data: any)=>`Olá, ${data.photographer.name}!! Um agendamento com a agência ${data.agency} foi reagendado:
        
Dia: ${data.schedule.day} as ${data.schedule.hour}
Serviços: ${data.services}
        
Endereço: ${data.property.address}
Bairro: ${data.property.neighborhood}
Corretor responsável: ${data.broker.name}
Vai acompanhar: ${data.broker.accompany}
${data?.rescheduleReason || 'O motivo do reagendamento não foi informado.'}
        
> Para *cancelar* clique aqui https://whatsapp-cr.onrender.com/booking/${data.bookingId}/cancel`,

    cancelledMessage: (data: any)=>`Olá, ${data.photographer.name}!! Um agendamento com a agência ${data.agency} foi cancelado:
        
${data?.cancelledReason || 'O motivo não foi informado.'}

Dia: ${data.schedule.day} as ${data.schedule.hour}`
} 