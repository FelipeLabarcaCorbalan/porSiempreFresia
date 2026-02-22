// app/page.tsx
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import CarruselImagenes from '@/app/components/CarruselImagenes';
import ListaMensajes from '@/app/components/ListaMensajes';
import BotonFormulario from '@/app/components/BotonFormulario';

export const revalidate = 60; // Revalidar cada 60 segundos

async function getMensajesAprobados() {
  const cookieStore = await cookies();

  // const supabase = createServerClient(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  //   {
  //     cookies: {
  //       get(name: string) {
  //         return cookieStore.get(name)?.value;
  //       },
  //     },
  //   }
  // );

  // const { data, error } = await supabase
  //   .from('condolencias')
  //   .select('*')
  //   .eq('aprobado', true)
  //   .order('created_at', { ascending: false })
  //   .limit(50); // Límite para evitar carga excesiva

  // if (error) {
  //   console.error('Error al obtener mensajes:', error);
  //   return [];
  // }

  return  [];
}

export default async function HomePage() {
  const mensajes = await getMensajesAprobados();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-2">
            Fresia por siempre
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            1950 - 2024
          </p>
          <div className="w-24 h-1 bg-gray-300 mx-auto mt-4 rounded"></div>
        </div>
      </header>

      {/* Carrusel de Imágenes */}
      <section className="w-full">
        <CarruselImagenes />
      </section>

      {/* Botón para dejar mensaje */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <BotonFormulario />
      </section>

      {/* Lista de Mensajes */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif text-gray-800 mb-2">
            Mensajes de Condolencia
          </h2>
          <p className="text-gray-500 text-sm">
            {mensajes.length} mensajes recibidos
          </p>
        </div>

        <ListaMensajes mensajes={mensajes} />
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            Libro de condolencias online
          </p>
          <p className="text-gray-500 text-xs mt-2">
            © 2024 - Todos los derechos reservados
          </p>
        </div>
      </footer>
    </main>
  );
}