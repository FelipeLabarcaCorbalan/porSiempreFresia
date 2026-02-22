'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function BotonFormulario() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <button
        onClick={() => router.push('/formulario')}
        className="inline-flex items-center gap-3 bg-gray-800 hover:bg-gray-900 text-white px-8 py-4 rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 active:translate-y-0 w-full md:w-auto justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        Dejar una Condolencia
      </button>
      <p className="text-gray-500 text-sm mt-3">
        Tu mensaje será revisado antes de publicarse
      </p>
    </motion.div>
  );
}