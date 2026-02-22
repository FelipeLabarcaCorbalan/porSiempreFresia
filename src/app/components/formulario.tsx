'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr'
import { motion, AnimatePresence } from 'framer-motion'; // Opcional: para animaciones suaves

export default function FormularioCondolencias() {
//   const supabase = createBrowserClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//   )
  
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    mensaje: ''
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    // Validación básica
    if (!formData.nombre || !formData.correo || !formData.mensaje) {
      setStatus('error');
      setErrorMessage('Por favor, completa todos los campos.');
      return;
    }

    // try {
    //   const { error } = await supabase
    //     .from('condolencias')
    //     .insert([
    //       { 
    //         nombre: formData.nombre, 
    //         correo: formData.correo, 
    //         mensaje: formData.mensaje 
    //       }
    //     ]);

    //   if (error) throw error;

    //   // 2. Flujo de Notificación (Explicación en notas abajo)
    //   // Aquí podrías llamar a una API Route propia que envíe el email,
    //   // O confiar en que Supabase tiene un Trigger configurado para esto.
      
    //   setStatus('success');
    //   setFormData({ nombre: '', correo: '', mensaje: '' }); // Limpiar formulario

    // } catch (error) {
    //   console.error('Error al enviar condolencia:', error);
    //   setStatus('error');
    //   setErrorMessage('Hubo un error al enviar tu mensaje. Inténtalo de nuevo.');
    // }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white shadow-lg rounded-xl border border-gray-100">
      <h2 className="text-2xl font-serif text-center text-gray-800 mb-6">
        Deja tu condolencia
      </h2>

      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900">Mensaje enviado</h3>
            <p className="text-gray-500 mt-2">
              Gracias por tus palabras. Tu mensaje será revisado y publicado pronto.
            </p>
            <button 
              onClick={() => setStatus('idle')}
              className="mt-6 text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Enviar otro mensaje
            </button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit} 
            className="space-y-4"
          >
            {/* Input Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-all text-gray-900"
                placeholder="Tu nombre"
                required
              />
            </div>

            {/* Input Correo */}
            <div>
              <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                id="correo"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-all text-gray-900"
                placeholder="tu@email.com"
                required
              />
            </div>

            {/* Input Mensaje */}
            <div>
              <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-1">
                Tu mensaje de condolencia
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-all text-gray-900 resize-none"
                placeholder="Escribe aquí tus recuerdos o palabras de apoyo..."
                required
              />
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={status === 'loading'}
              className={`w-full py-4 px-6 rounded-lg font-medium text-white transition-all transform active:scale-95 
                ${status === 'loading' 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gray-800 hover:bg-gray-900 shadow-md hover:shadow-lg'
                }`}
            >
              {status === 'loading' ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </span>
              ) : (
                'Enviar Mensaje'
              )}
            </button>

            {status === 'error' && (
              <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                {errorMessage}
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}