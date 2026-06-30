import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export interface DadosDashboard {
  projetosAtivos: number
  projetosArquivados: number
  projetosConcluidos: number
  projetosExcluidos: number
  itensConcluidos: number
  itensPendentes: number
}

const VAZIO: DadosDashboard = {
  projetosAtivos: 0,
  projetosArquivados: 0,
  projetosConcluidos: 0,
  projetosExcluidos: 0,
  itensConcluidos: 0,
  itensPendentes: 0,
}

/**
 * Busca e calcula os números do dashboard resumido (tela "Hoje").
 *
 * "Projetos ativos" = não arquivados e não excluídos.
 * "Projetos concluídos" = projetos ativos cujo status tem nome "Concluído".
 * Os contadores de itens de checklist somam de todos os projetos não excluídos.
 */
export function useDashboard() {
  const [dados, setDados] = useState<DadosDashboard>(VAZIO)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    let cancelado = false

    async function carregar() {
      setCarregando(true)

      const [projetosResp, statusResp, checklistResp] = await Promise.all([
        supabase
          .from("projetos")
          .select("id, status_id, arquivado, excluido"),
        supabase.from("status").select("id, nome"),
        supabase
          .from("checklist_items")
          .select("concluido, projeto_id, projetos!inner(excluido)"),
      ])

      if (cancelado) return

      const projetos = projetosResp.data ?? []
      const statusList = statusResp.data ?? []
      const checklist = checklistResp.data ?? []

      const idStatusConcluido = statusList.find(
        (s) => s.nome.trim().toLowerCase() === "concluído"
      )?.id

      const ativos = projetos.filter((p) => !p.arquivado && !p.excluido)
      const arquivados = projetos.filter((p) => p.arquivado && !p.excluido)
      const excluidos = projetos.filter((p) => p.excluido)
      const concluidos = ativos.filter(
        (p) => p.status_id === idStatusConcluido
      )

      const itensConcluidos = checklist.filter((i) => i.concluido).length
      const itensPendentes = checklist.filter((i) => !i.concluido).length

      setDados({
        projetosAtivos: ativos.length,
        projetosArquivados: arquivados.length,
        projetosConcluidos: concluidos.length,
        projetosExcluidos: excluidos.length,
        itensConcluidos,
        itensPendentes,
      })
      setCarregando(false)
    }

    carregar()

    return () => {
      cancelado = true
    }
  }, [])

  return { dados, carregando }
}
