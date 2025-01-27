export function transformDateTime(rawDate: any){
    const date = new Date(rawDate);

    // Formatar a data no formato dd/mm/yyyy
    const formattedDate = date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    // Formatar as horas no formato hh:mm
    const formattedTime = date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    return { day: formattedDate, hour: formattedTime };
}

export function transformPhone(phone: any){
    let regex = /^\+?(\d{2})(\d{2})(9?)(\d{4})(\d{4})$/
    const whatsapp = phone.replace(regex, '$1$2$4$5')
    return whatsapp
}