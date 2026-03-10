'use server'

import { headers } from 'next/headers'
import { createClient } from '../utils/supabase/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { localCache } from '../utils/rateLimitCache'

const ratelimitIp = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(1, "24 h"), 
  analytics: false, 
  prefix: "ratelimit:ip:condolencias",
})

export async function enviarCondolencia(formData: FormData) {
    const honeypot = formData.get('website') as string
    const formTiming = formData.get('formTiming') as string
    if (honeypot) {
      console.log('honeypot')
      return { 
        success: true, 
        message: 'Mensaje enviado correctamente',
        botDetected: true
      }
    }
    if (formTiming) {
      const timeSpent = Date.now() - parseInt(formTiming)
      if (timeSpent < 2000) {
        console.log('tiempo de envío')
        return { 
          success: true, 
          message: 'Mensaje enviado correctamente',
          botDetected: true
        }
      }
    }

    const nombre = formData.get('nombre') as string
    const correo = formData.get('correo') as string
    const mensaje = formData.get('mensaje') as string
    if (!correo || !correo.includes('@') || !nombre || !mensaje) {
      return {
        success: false,
        message: 'Todos los campos son obligatorios'
      }
    }
    const headerList = await headers()
    const userIp = headerList.get('x-forwarded-for') || '127.0.0.1'

    //cache local
    const ipLocalCheck = localCache.checkIp(userIp)
    const emailLocalCheck = localCache.checkEmail(correo)

    if (!ipLocalCheck.allowed) {
      console.log(`Bloqueado por cache local: ${userIp}`)
      return {
        success: false,
        message: 'Ya has enviado un mensaje recientemente desde esta IP.'
      }
    }

    if (!emailLocalCheck.allowed) {
      console.log(`Bloqueado por cache local: ${correo}`)
      return {
        success: false,
        message: 'Este correo ya ha sido utilizado recientemente.'
      }
    }
    
    //redis
    let ipRedisAllowed = true
 

    try {
      const ipRedisCheck = await ratelimitIp.limit(userIp)
      ipRedisAllowed = ipRedisCheck.success
     
      if (!ipRedisAllowed) {
        console.log(`Bloqueado por Redis : ${userIp}`)
        console.log(`ipLocalCheck : ${ipLocalCheck.allowed}`)
        console.log(`emailLocalCheck : ${emailLocalCheck.allowed}`)
        // Actualizar cache local para futuros bloqueos
        localCache.registerSuccess(userIp, correo)
        return {
          success: false,
          message: 'Ya has enviado un mensaje.'
        }
      }
    } catch (redisError) {
      console.log('⚠️ Redis error:', redisError)
    }

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
    localCache.registerSuccess(userIp, correo)
    return { success: true, message: 'Mensaje enviado correctamente' }
}