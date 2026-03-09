'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IMAGENES = [
  'https://yfevsjkizyncymtgflqz.supabase.co/storage/v1/object/public/img/1.jpeg',
  'https://yfevsjkizyncymtgflqz.supabase.co/storage/v1/object/public/img/2.jpeg',
  'https://yfevsjkizyncymtgflqz.supabase.co/storage/v1/object/public/img/3.jpeg',
  'https://yfevsjkizyncymtgflqz.supabase.co/storage/v1/object/public/img/4.jpeg',
  'https://yfevsjkizyncymtgflqz.supabase.co/storage/v1/object/public/img/5.jpeg',
  'https://yfevsjkizyncymtgflqz.supabase.co/storage/v1/object/public/img/6.jpeg',
  'https://yfevsjkizyncymtgflqz.supabase.co/storage/v1/object/public/img/7.jpeg',
  'https://yfevsjkizyncymtgflqz.supabase.co/storage/v1/object/public/img/8.jpeg',
  'https://yfevsjkizyncymtgflqz.supabase.co/storage/v1/object/public/img/9.jpeg',
  'https://yfevsjkizyncymtgflqz.supabase.co/storage/v1/object/public/img/10.jpeg',
  'https://yfevsjkizyncymtgflqz.supabase.co/storage/v1/object/public/img/11.jpeg',
  'https://yfevsjkizyncymtgflqz.supabase.co/storage/v1/object/public/img/12.jpeg',
  'https://yfevsjkizyncymtgflqz.supabase.co/storage/v1/object/public/img/13.jpeg',
  'https://yfevsjkizyncymtgflqz.supabase.co/storage/v1/object/public/img/14.jpeg',
];

export default function CarruselImagenes() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % IMAGENES.length);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + IMAGENES.length) % IMAGENES.length);
  };

  // Auto-play
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Soporte para swipe en móvil
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsPaused(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    setIsPaused(false);
    
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  return (
    <div 
      className="relative w-full h-[60vh] md:h-[50vh] overflow-hidden bg-gray-200"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence initial={false} custom={currentIndex}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img
            src={IMAGENES[currentIndex]}
            alt={`Memoria ${currentIndex + 1}`}
            className="w-full h-full object-contain"
            loading={currentIndex === 0 ? 'eager' : 'lazy'}
          />
          {/* Overlay oscuro para mejor legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </motion.div>
      </AnimatePresence>

      {/* Indicadores de posición */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {IMAGENES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Ir a imagen ${index + 1}`}
          />
        ))}
      </div>

      {/* Botones de navegación (ocultos en móvil muy pequeño) */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all hidden md:block"
        aria-label="Imagen anterior"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all hidden md:block"
        aria-label="Imagen siguiente"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}