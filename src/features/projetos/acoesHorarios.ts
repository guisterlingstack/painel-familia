import { supabase } from "@/lib/supabase"

export interface HorarioSelecionado {
  diaSemana: number // 0 = domingo ... 6 = sábado
  horario: string // "HH:MM:SS"
}

/**
 * Substitui toda a programação de horários de um projeto pela nova
 * lista informada. Apaga os horários antigos e insere os novos —
 * estratégia mais simples e segura do que calcular diferenças.
 */
export async function salvarHorariosProjeto(
  projetoId: string,
  horarios: HorarioSelecionado[]
) {
  const { error: erroDelete } = await supabase
    .from("projeto_horarios")
    .delete()
    .eq("projeto_id", projetoId)

  if (erroDelete) throw new Error(erroDelete.message)

  if (horarios.length === 0) return

  const { error: erroInsert } = await supabase
    .from("projeto_horarios")
    .insert(
      horarios.map((h) => ({
        projeto_id: projetoId,
        dia_semana: h.diaSemana,
        horario: h.horario,
      }))
    )

  if (erroInsert) throw new Error(erroInsert.message)
}
