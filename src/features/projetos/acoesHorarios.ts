import { supabase } from "@/lib/supabase"

export interface HorarioSelecionado {
  data: string // "YYYY-MM-DD"
  horario: string // "HH:MM:SS"
}

/**
 * Substitui toda a programação de horários de um projeto pela nova
 * lista informada. Apaga os horários antigos e insere os novos —
 * estratégia mais simples e segura do que calcular diferenças.
 *
 * Cada item representa uma data REAL específica (não mais um padrão
 * semanal abstrato) — ex: "marcar este projeto no sábado 04/07/2026
 * às 19:00", e não "todo sábado às 19:00".
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
        data: h.data,
        horario: h.horario,
      }))
    )

  if (erroInsert) throw new Error(erroInsert.message)
}
