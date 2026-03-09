import { createClient } from './client'

export async function getMensajesAprobados() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('condolencias')
    .select('*')
    .eq('aprobado', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error al obtener mensajes:', error);
    return [];
  }

  return data;
}