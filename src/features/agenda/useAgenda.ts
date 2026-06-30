import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export interface EventoAgenda {
  horarioId: string
  diaSemana: number // 0 = domingo ... 6 = sábado
  horario: string // "HH:MM:SS"
  projetoId: string
  nomeProjeto: string
  corCategoria: string | null
}

/**
 * Busca todos os horários programados de todos os projetos ativos
 * (não arquivados, não excluídos).
 *
 * A programação é um padrão semanal recorrente (ex: "toda Segunda
 * às 08:00"), então não filtramos por uma semana específica aqui —
 * a tela de Agenda é quem cruza esse padrão com os dias reais da
 * semana sendo exibida (ver src/lib/semana.ts).
 */
export function useAgenda() {
  const [eventos, setEventos] = useState<EventoAgenda[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    let cancelado = false

    async function carregar() {
      setCarregando(true)

      const { data, error } = await supabase
        .from("projeto_horarios")
        .select(
          `
          id,
          dia_semana,
          horario,
          projetos!inner (
            id,
            nome,
            arquivado,
            excluido,
            categorias ( cor )
          )
        `
        )
        .eq("projetos.arquivado", false)
        .eq("projetos.excluido", false)

      if (cancelado) return

      if (error || !data) {
        setEventos([])
        setCarregando(false)
        return
      }

      const lista: EventoAgenda[] = data.map((linha: any) => ({
        horarioId: linha.id,
        diaSemana: linha.dia_semana,
        horario: linha.horario,
        projetoId: linha.projetos.id,
        nomeProjeto: linha.projetos.nome,
        corCategoria: linha.projetos.categorias?.cor ?? null,
      }))

      setEventos(lista)
      setCarregando(false)
    }

    carregar()

    return () => {
      cancelado = true
    }
  }, [])

  return { eventos, carregando }
}
