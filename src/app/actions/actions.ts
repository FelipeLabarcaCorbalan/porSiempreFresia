'use server'

import { headers } from 'next/headers'
import { createClient } from '../utils/supabase/server'

export async function enviarCondolencia(formData: FormData) {
    const nombre = formData.get('nombre') as string
    const correo = formData.get('correo') as string
    const mensaje = formData.get('mensaje') as string

    const headerList = await headers()
    const userIp = headerList.get('x-forwarded-for') || '127.0.0.1'

    const supabase = await createClient(userIp);

    const { error } = await supabase
        .from('condolencias')
        .insert([
            {
                nombre,
                correo,
                mensaje
            }
        ])

    if (error) {
        console.log('error en enviar condolencia', error)
        return {
            success: false,
            message: error.message
        }
    }

    return { success: true, message: 'Mensaje enviado correctamente' }
}