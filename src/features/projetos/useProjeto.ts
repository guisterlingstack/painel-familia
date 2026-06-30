import { useCallback, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { ChecklistItem, ProjetoHorario } from "@/types/database"

export interface ProjetoDetalhe {
  id: string
  nome: string
  descricao: string | null
  statusId: string | null
  prioridadeId: string | null
  categoriaId: string | null
  arquivado: boolean
  excluido: boolean
  criadoEm: string
  nomeCriador: string | null
}

/**
 * Busca um projeto específico (pelo id), seus itens de checklist e
 * seus horários programados na agenda. Expõe `recarregar` para ser
 * chamado depois de qualquer alteração.
 */
export function useProjeto(id: string | undefined) {
  const [projeto, setProjeto] = useState<ProjetoDetalhe | null>(null)
  const [checklist, setChecklist] = useState<ChecklistItem[]>([])
  const [horarios, setHorarios] = useState<ProjetoHorario[]>([])
  const [carregando, setCarregando] = useState(true)
  const [naoEncontrado, setNaoEncontrado] = useState(false)

  const carregar = useCallback(async () => {
    if (!id) return
    setCarregando(true)

    const [projetoResp, checklistResp, horariosResp] = await Promise.all([
      supabase
        .from("projetos")
        .select(
          `
          id, nome, descricao, status_id, prioridade_id, categoria_id,
          arquivado, excluido, criado_em,
          pessoas:criado_por ( nome )
        `
        )
        .eq("id", id)
        .maybeSingle(),
      supabase
        .from("checklist_items")
        .select("*")
        .eq("projeto_id", id)
        .order("ordem"),
      supabase.from("projeto_horarios").select("*").eq("projeto_id", id),
    ])

    if (!projetoResp.data) {
      setNaoEncontrado(true)
      setCarregando(false)
      return
    }

    const p: any = projetoResp.data
    setProjeto({
      id: p.id,
      nome: p.nome,
      descricao: p.descricao,
      statusId: p.status_id,
      prioridadeId: p.prioridade_id,
      categoriaId: p.categoria_id,
      arquivado: p.arquivado,
      excluido: p.excluido,
      criadoEm: p.criado_em,
      nomeCriador: p.pessoas?.nome ?? null,
    })
    setChecklist(checklistResp.data ?? [])
    setHorarios(horariosResp.data ?? [])
    setCarregando(false)
  }, [id])

  useEffect(() => {
    carregar()
  }, [carregar])

  return {
    projeto,
    checklist,
    horarios,
    carregando,
    naoEncontrado,
    recarregar: carregar,
  }
}
