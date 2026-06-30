import { useCallback, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export interface ProjetoListado {
  id: string
  nome: string
  descricao: string | null
  arquivado: boolean
  excluido: boolean
  criadoEm: string
  statusId: string | null
  nomeStatus: string | null
  prioridadeId: string | null
  nomePrioridade: string | null
  emojiPrioridade: string | null
  categoriaId: string | null
  nomeCategoria: string | null
  corCategoria: string | null
  nomeCriador: string | null
}

export type AbaProjetos = "ativos" | "arquivados" | "excluidos"

/**
 * Busca a lista de projetos filtrada por aba (ativos / arquivados /
 * excluídos), já trazendo os dados relacionados (status, prioridade,
 * categoria, criador) prontos para exibição direta nos cards.
 *
 * Expõe `recarregar` para ser chamado depois de criar, editar,
 * duplicar, arquivar ou excluir um projeto.
 */
export function useProjetos(aba: AbaProjetos) {
  const [projetos, setProjetos] = useState<ProjetoListado[]>([])
  const [carregando, setCarregando] = useState(true)

  const carregar = useCallback(async () => {
    setCarregando(true)

    let query = supabase
      .from("projetos")
      .select(
        `
        id, nome, descricao, arquivado, excluido, criado_em,
        status_id, status ( nome ),
        prioridade_id, prioridades ( nome, emoji ),
        categoria_id, categorias ( nome, cor ),
        pessoas:criado_por ( nome )
      `
      )
      .order("criado_em", { ascending: false })

    if (aba === "ativos") {
      query = query.eq("arquivado", false).eq("excluido", false)
    } else if (aba === "arquivados") {
      query = query.eq("arquivado", true).eq("excluido", false)
    } else {
      query = query.eq("excluido", true)
    }

    const { data, error } = await query

    if (error || !data) {
      setProjetos([])
      setCarregando(false)
      return
    }

    const lista: ProjetoListado[] = data.map((linha: any) => ({
      id: linha.id,
      nome: linha.nome,
      descricao: linha.descricao,
      arquivado: linha.arquivado,
      excluido: linha.excluido,
      criadoEm: linha.criado_em,
      statusId: linha.status_id,
      nomeStatus: linha.status?.nome ?? null,
      prioridadeId: linha.prioridade_id,
      nomePrioridade: linha.prioridades?.nome ?? null,
      emojiPrioridade: linha.prioridades?.emoji ?? null,
      categoriaId: linha.categoria_id,
      nomeCategoria: linha.categorias?.nome ?? null,
      corCategoria: linha.categorias?.cor ?? null,
      nomeCriador: linha.pessoas?.nome ?? null,
    }))

    setProjetos(lista)
    setCarregando(false)
  }, [aba])

  useEffect(() => {
    carregar()
  }, [carregar])

  return { projetos, carregando, recarregar: carregar }
}
