interface CacheEntry {
  timestamp: number
  count: number
}

class LocalRateLimitCache {
  private ipCache: Map<string, CacheEntry>
  private emailCache: Map<string, CacheEntry>
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 horas en ms

  constructor() {
    this.ipCache = new Map()
    this.emailCache = new Map()
    this.startCleanupInterval()
  }

  // Verificar IP en cache local
  checkIp(ip: string): { allowed: boolean; remaining: number } {
    const key = `ip:${ip}`
    const entry = this.ipCache.get(key)
    console.log('key',key)
    console.log('entry',entry)
    if (!entry) {
      return { allowed: true, remaining: 1 }
    }

    const hoursSinceLast = (Date.now() - entry.timestamp) / (1000 * 60 * 60)
    
    if (hoursSinceLast < 24) {
      return { allowed: false, remaining: 0 }
    }

    // Si pasaron más de 24 horas, permitir y limpiar
    this.ipCache.delete(key)
    return { allowed: true, remaining: 1 }
  }

  // Verificar email en cache local
  checkEmail(email: string): { allowed: boolean; remaining: number } {
    const key = `email:${email}`
    const entry = this.emailCache.get(key)
    
    if (!entry) {
      return { allowed: true, remaining: 1 }
    }

    const hoursSinceLast = (Date.now() - entry.timestamp) / (1000 * 60 * 60)
    
    if (hoursSinceLast < 24) {
      return { allowed: false, remaining: 0 }
    }

    // Si pasaron más de 24 horas, permitir y limpiar
    this.emailCache.delete(key)
    return { allowed: true, remaining: 1 }
  }

  // Registrar envío exitoso en cache local
  registerSuccess(ip: string, email: string) {
    this.ipCache.set(`ip:${ip}`, {
      timestamp: Date.now(),
      count: 1
    })
    
    this.emailCache.set(`email:${email}`, {
      timestamp: Date.now(),
      count: 1
    })
  }

  // Limpiar entradas expiradas cada hora
  private startCleanupInterval() {
    setInterval(() => {
      const now = Date.now()
      
      this.ipCache.forEach((entry, key) => {
        if (now - entry.timestamp > this.CACHE_DURATION) {
          this.ipCache.delete(key)
        }
      })
      
      this.emailCache.forEach((entry, key) => {
        if (now - entry.timestamp > this.CACHE_DURATION) {
          this.emailCache.delete(key)
        }
      })
      
      console.log(`🧹 Cache limpiado - IPs: ${this.ipCache.size}, Emails: ${this.emailCache.size}`)
    }, 60 * 60 * 1000) // Cada hora
  }

  // Estadísticas
  getStats() {
    return {
      ipsEnCache: this.ipCache.size,
      emailsEnCache: this.emailCache.size,
      memoriaAproximada: JSON.stringify([...this.ipCache, ...this.emailCache]).length
    }
  }
}

export const localCache = new LocalRateLimitCache();