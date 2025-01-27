import { delay } from "@whiskeysockets/baileys";

export function transformDateTime(rawDate: any){
    const date = new Date(rawDate);

    // Formatar a data no formato dd/mm/yyyy
    const formattedDate = new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'UTC'
    }).format(date);

    // Formatar as horas no formato hh:mm
    const formattedTime = new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC' // Certifica que está no fuso horário brasileiro
    }).format(date);

    return { day: formattedDate, hour: formattedTime };
}

export function transformPhone(phone: any){
    let regex = /^\+?(\d{2})(\d{2})(9?)(\d{4})(\d{4})$/
    const whatsapp = phone.replace(regex, '$1$2$4$5')
    return whatsapp
}

export async function delayFunction(function1: any, function2: any){
    await function1()
    await delay(5000)
    await function2()
}