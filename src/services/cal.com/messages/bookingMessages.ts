export const booking = {
    
    requestedMessage: (data: any) => `Um novo agendamento da agência ${data.agency} com o fotógrafo foi *pré-reservado*! Confira os dados:
        
Serviços: ${data.services}
Imóvel: ${data.property.id}
Endereço: ${data.property.address}

No dia ${data.schedule.start.day}
A partir das ${data.schedule.start.hour} até ${data.schedule.end}
    
Corretor responsável: *${data.broker.name}* 
Vai acompanhar: ${data.broker.accompany}
${data?.notes || ''}
        
*Aguarde a confirmação da reserva!*
    
> Para alterar ou cancelar, clique aqui ${data.page}
> Para agendar uma data para outro imóvel clique aqui https://cal.com/creditoreal/agendar-fotos`,

    rejectedMessage: (data: any)=>`O agendamento de fotos para o imóvel ${data.property.id}, da agência ${data.agency} foi *recusado*.

No dia ${data.schedule.start.day} as ${data.schedule.start.hour}
${data?.rejectedReason || 'O motivo não foi informado.'}

> Para agendar uma nova data para esse ou outro imóvel visite https://cal.com/creditoreal/agendar-fotos`,

    createdMessage: (data: any)=> `Oba! Temos ótimas notícias!! O agendamento da agência ${data.agency} com o fotógrafo está *confirmado*! Confira os dados:
        
Serviços: ${data.services}
Imóvel: ${data.property.id}
Endereço: ${data.property.address}

No dia ${data.schedule.start.day}
A partir das ${data.schedule.start.hour} até ${data.schedule.end}
    
Corretor responsável: *${data.broker.name}* 
Vai acompanhar: ${data.broker.accompany}
${data?.notes || ''}
        
*Estamos ansiosos pra ver o material!*
    
> Para alterar ou cancelar, clique aqui ${data.page}
> Para agendar uma data para outro imóvel clique aqui https://cal.com/creditoreal/agendar-fotos`,

    rescheduleMessage: (data: any)=>`Hey! Passando para avisar que o agendamento da agência ${data.agency} com o fotógrafo foi *reagendado*! Confira os dados:
        
Serviços: ${data.services}
Imóvel: ${data.property.id}
Endereço: ${data.property.address}

*NOVA DATA*
No dia ${data.schedule.start.day}
A partir das ${data.schedule.start.hour} até ${data.schedule.end}
    
Corretor responsável *${data.broker.name}* 
Vai acompanhar: ${data.broker.accompany}
${data?.rescheduleReason || 'O motivo do reagendamento não foi informado.'}

*Estamos anciosos pra ver o material!*
    
> Para alterar ou cancelar, clique aqui ${data.page}
> Para agendar uma data para outro imóvel clique aqui https://cal.com/creditoreal/agendar-fotos`,

    cancelledMessage: (data: any)=> `O agendamento de fotos para o imóvel ${data.property.id}, da agência ${data.agency} foi *cancelado*.

No dia ${data.schedule.start.day} as ${data.schedule.start.hour}
 ${data?.cancelledReason || 'O motivo não foi informado.'}

> Para agendar uma nova data para esse ou outro imóvel visite https://cal.com/creditoreal/agendar-fotos`,

    start: (data: any)=>`Olá! Passando para informar que o fotógrafo está no local para iniciar o serviço agendado:

Imóvel: ${data.property.id}
${data.property.address}
Hora de inicio: ${data.serviceStatus.start.hour}
Serviços: ${data.services}`,

    end: (data: any)=>`Agora a notícia é melhor ainda! O fotórgrafo finalizou o serviço agendado:

Imóvel: ${data.property.id}
${data.property.address}
Hora de finalização: ${data.serviceStatus.end.hour}
Serviços: ${data.services}

A disponibilidade do material produzido será comunicada por email.

> Para agendar uma data para outro imóvel clique aqui https://cal.com/creditoreal/agendar-fotos`
}

export const photographer = {
    requestedMessage: (data: any)=>`Olá, ${data.photographer.name}!! A agência ${data.agency} solicitou um novo agendamento:
        
Dia ${data.schedule.start.day}
A partir das ${data.schedule.start.hour} até ${data.schedule.end}
Serviços: ${data.services}

Imóvel: ${data.property.id}
Endereço: ${data.property.address}
Bairro: ${data.property.neighborhood}
Corretor responsável: ${data.broker.name}
Vai acompanhar: ${data.broker.accompany}
${data?.notes || ''}
        
> Para *confirmar* o agendamento clique aqui https://whatsapp-cr.onrender.com/booking/${data.id}/confirm
> Para *reagendar* clique aqui ${data.page}
> Para *recusar* clique aqui https://whatsapp-cr.onrender.com/booking/${data.id}/decline`,

    rejectedMessage: (data: any)=>`Olá, ${data.photographer.name}!! Você recusou um agendamento com a agência ${data.agency}:

Imóvel: ${data.property.id}
${data?.rejectedReason || 'O motivo não foi informado.'}

Dia: ${data.schedule.start.day} as ${data.schedule.start.hour}`,

    createdMessage: (data: any)=>`Olá, ${data.photographer.name}!! Um agendamento com a agência ${data.agency} foi confirmado:
        
Dia ${data.schedule.start.day}
A partir das ${data.schedule.start.hour} até ${data.schedule.end}
Serviços: ${data.services}

Imóvel: ${data.property.id}
Endereço: ${data.property.address}
Bairro: ${data.property.neighborhood}
Corretor responsável: ${data.broker.name}
Vai acompanhar: ${data.broker.accompany}
${data?.notes || ''}
        
> Para *cancelar* clique aqui https://whatsapp-cr.onrender.com/booking/${data.id}/cancel`,

    rescheduleMessage: (data: any)=>`Olá, ${data.photographer.name}!! Um agendamento com a agência ${data.agency} foi reagendado:
 
*NOVA DATA*
Dia ${data.schedule.start.day}
A partir das ${data.schedule.start.hour} até ${data.schedule.end}
Serviços: ${data.services}

Imóvel: ${data.property.id}
Endereço: ${data.property.address}
Bairro: ${data.property.neighborhood}
Corretor responsável: ${data.broker.name}
Vai acompanhar: ${data.broker.accompany}
${data?.rescheduleReason || 'O motivo do reagendamento não foi informado.'}

${data.status === 'PENDING' ? `> Para *confirmar* o agendamento clique aqui https://whatsapp-cr.onrender.com/booking/${data.id}/confirm` : ''}         
> Para *cancelar* clique aqui https://whatsapp-cr.onrender.com/booking/${data.id}/cancel`,

    cancelledMessage: (data: any)=>`Olá, ${data.photographer.name}!! Um agendamento com a agência ${data.agency} foi cancelado:

Imóvel: ${data.property.id}
${data?.cancelledReason || 'O motivo não foi informado.'}

O dia: ${data.schedule.start.day} as ${data.schedule.start.hour} está liberado para novos agendamentos`
} 