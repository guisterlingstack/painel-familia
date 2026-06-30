import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { dataParaISO } from "@/lib/calendarioMensal"

export interface ProjetoDoDia {
  horarioId: string
  horario: string // "HH:MM:SS"
  projetoId: string
  nomeProjeto: string
  corCategoria: string | null
  nomeStatus: string | null
  nomeCriador: string | null
}

/**
 * Busca os projetos programados para a data real de hoje,
 * cruzando "projeto_horarios" com "projetos" e trazendo dados
 * relacionados (categoria, status, criador) para exibição direta.
 *
 * Projetos arquivados ou excluídos não aparecem na tela "Hoje".
 */
export function useProjetosDoDia() {
  const [projetosDoDia, setProjetosDoDia] = useState<ProjetoDoDia[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    let cancelado = false

    async function carregar() {
      setCarregando(true)

      const hojeISO = dataParaISO(new Date())

      const { data, error } = await supabase
        .from("projeto_horarios")
        .select(
          `
          id,
          horario,
          projetos!inner (
            id,
            nome,
            arquivado,
            excluido,
            categorias ( cor ),
            status ( nome ),
            pessoas:criado_por ( nome )
          )
        `
        )
        .eq("data", hojeISO)
        .eq("projetos.arquivado", false)
        .eq("projetos.excluido", false)
        .order("horario")

      if (cancelado) return

      if (error || !data) {
        setProjetosDoDia([])
        setCarregando(false)
        return
      }

      const lista: ProjetoDoDia[] = data.map((linha: any) => ({
        horarioId: linha.id,
        horario: linha.horario,
        projetoId: linha.projetos.id,
        nomeProjeto: linha.projetos.nome,
        corCategoria: linha.projetos.categorias?.cor ?? null,
        nomeStatus: linha.projetos.status?.nome ?? null,
        nomeCriador: linha.projetos.pessoas?.nome ?? null,
      }))

      setProjetosDoDia(lista)
      setCarregando(false)
    }

    carregar()

    return () => {
      cancelado = true
    }
  }, [])

  return { projetosDoDia, carregando }
}
