// components/ListaMensajes.tsx
'use client';

import { motion } from 'framer-motion';

interface Mensaje {
  id: string;
  nombre: string;
  mensaje: string;
  created_at: string;
}

interface ListaMensajesProps {
  mensajes: Mensaje[];
}

export default function ListaMensajes({ mensajes }: ListaMensajesProps) {
  // Función para sanitizar texto y prevenir XSS
  const sanitizeText = (text: string) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  if (mensajes.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <p className="text-gray-500">
          Sé el primero en dejar un mensaje de condolencia
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {mensajes.map((mensaje, index) => (
        <motion.article
          key={mensaje.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start gap-4">
            {/* Avatar con inicial */}
            <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold text-lg">
              {mensaje.nombre.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900 truncate">
                  {/* Usamos textContent en lugar de dangerouslySetInnerHTML */}
                  <span>{mensaje.nombre}</span>
                </h3>
                <time className="text-xs text-gray-400 whitespace-nowrap ml-2">
                  {formatDate(mensaje.created_at)}
                </time>
              </div>
              
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                {/* Renderizado seguro sin dangerouslySetInnerHTML */}
                {mensaje.mensaje}
              </p>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}