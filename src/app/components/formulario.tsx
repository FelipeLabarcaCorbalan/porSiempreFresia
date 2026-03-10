'use client';

import { useState } from 'react';
import { enviarCondolencia } from '../actions/actions'
import { motion, AnimatePresence } from 'framer-motion'; 

export default function FormularioCondolencias() {


  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [formStartTime] = useState(Date.now());

  const handleSubmit = async (formData: FormData) => {
    setStatus('loading');
    setErrorMessage('');
    try {
      formData.append('formTiming', formStartTime.toString())
      const result = await enviarCondolencia(formData);

      if (result.success) {
        setStatus('success');
      } else {
        setErrorMessage(result.message || 'Error al enviar el mensaje');
        setStatus('error');
      }
    } catch (error) {
      setErrorMessage('Ocurrió un error inesperado');
      setStatus('error');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white shadow-lg rounded-xl border border-gray-100">
      <h2 className="text-2xl font-serif text-center text-gray-800 mb-6">
        Deja tu condolencia
      </h2>

      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
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
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            action={handleSubmit} 
            className="space-y-4"
          >
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-all text-gray-900"
                placeholder="Tu nombre"
                required
                maxLength={100}
              />
            </div>

            <div>
              <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
              <input
                type="email"
                id="correo"
                name="correo"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-all text-gray-900"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-1">Tu mensaje</label>
              <textarea
                id="mensaje"
                name="mensaje"
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-all text-gray-900 resize-none"
                placeholder="Escribe aquí tus palabras..."
                required
                maxLength={1000}
              />
            </div>
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website">get out</label>
              <input
                type="text"
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                onChange={() => {}} 
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className={`w-full py-4 px-6 rounded-lg font-medium text-white transition-all transform active:scale-95 
                ${status === 'loading' 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gray-800 hover:bg-gray-900 shadow-md'
                }`}
            >
              {status === 'loading' ? 'Enviando...' : 'Enviar Mensaje'}
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