import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { dataParaISO } from "@/lib/calendarioMensal"

export interface EventoAgenda {
  horarioId: string
  data: string // "YYYY-MM-DD"
  horario: string // "HH:MM:SS"
  projetoId: string
  nomeProjeto: string
  corCategoria: string | null
}

/**
 * Busca os horários programados de todos os projetos ativos (não
 * arquivados, não excluídos) cujas datas caem dentro do intervalo
 * informado (a semana sendo exibida na tela de Agenda).
 *
 * Diferente da versão anterior (baseada em dia da semana abstrato),
 * agora cada horário já tem uma data real — então não há conversão
 * a fazer aqui, só um filtro direto por intervalo de datas.
 */
export function useAgenda(dataInicioISO: string, dataFimISO: string) {
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
          data,
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
        .gte("data", dataInicioISO)
        .lte("data", dataFimISO)
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
        data: linha.data,
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
  }, [dataInicioISO, dataFimISO])

  return { eventos, carregando }
}

export { dataParaISO }
