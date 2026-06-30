import { supabase } from "@/lib/supabase"

interface NovoProjetoInput {
  nome: string
  descricao: string | null
  statusId: string | null
  prioridadeId: string | null
  categoriaId: string | null
  criadoPor: string
}

/**
 * Registra uma entrada no log de alterações. Chamado internamente
 * por todas as funções de ação abaixo — assim toda alteração relevante
 * fica rastreável, conforme a especificação do sistema.
 */
async function registrarLog(
  projetoId: string,
  pessoaId: string,
  acao: string,
  detalhes?: string
) {
  await supabase.from("log_alteracoes").insert({
    projeto_id: projetoId,
    pessoa_id: pessoaId,
    acao,
    detalhes: detalhes ?? null,
  })
}

export async function criarProjeto(input: NovoProjetoInput) {
  const { data, error } = await supabase
    .from("projetos")
    .insert({
      nome: input.nome,
      descricao: input.descricao,
      status_id: input.statusId,
      prioridade_id: input.prioridadeId,
      categoria_id: input.categoriaId,
      criado_por: input.criadoPor,
    })
    .select()
    .single()

  if (error || !data) {
    throw new Error(error?.message ?? "Erro ao criar projeto.")
  }

  await registrarLog(data.id, input.criadoPor, "criado")

  return data
}

export async function duplicarProjeto(
  projetoId: string,
  pessoaId: string
) {
  // Busca o projeto original
  const { data: original, error: erroBusca } = await supabase
    .from("projetos")
    .select("nome, descricao, status_id, prioridade_id, categoria_id")
    .eq("id", projetoId)
    .single()

  if (erroBusca || !original) {
    throw new Error("Não foi possível encontrar o projeto original.")
  }

  // Cria a cópia
  const { data: copia, error: erroCriacao } = await supabase
    .from("projetos")
    .insert({
      nome: `${original.nome} (cópia)`,
      descricao: original.descricao,
      status_id: original.status_id,
      prioridade_id: original.prioridade_id,
      categoria_id: original.categoria_id,
      criado_por: pessoaId,
    })
    .select()
    .single()

  if (erroCriacao || !copia) {
    throw new Error("Não foi possível duplicar o projeto.")
  }

  // Copia também os itens de checklist
  const { data: itensOriginais } = await supabase
    .from("checklist_items")
    .select("texto, ordem")
    .eq("projeto_id", projetoId)

  if (itensOriginais && itensOriginais.length > 0) {
    await supabase.from("checklist_items").insert(
      itensOriginais.map((item) => ({
        projeto_id: copia.id,
        texto: item.texto,
        ordem: item.ordem,
        criado_por: pessoaId,
      }))
    )
  }

  await registrarLog(copia.id, pessoaId, "criado", `Duplicado de "${original.nome}"`)

  return copia
}

export async function arquivarProjeto(projetoId: string, pessoaId: string) {
  const { error } = await supabase
    .from("projetos")
    .update({ arquivado: true, arquivado_por: pessoaId })
    .eq("id", projetoId)

  if (error) throw new Error(error.message)

  await registrarLog(projetoId, pessoaId, "arquivado")
}

export async function desarquivarProjeto(
  projetoId: string,
  pessoaId: string
) {
  const { error } = await supabase
    .from("projetos")
    .update({ arquivado: false, arquivado_por: null })
    .eq("id", projetoId)

  if (error) throw new Error(error.message)

  await registrarLog(projetoId, pessoaId, "desarquivado")
}

export async function excluirProjeto(projetoId: string, pessoaId: string) {
  const { error } = await supabase
    .from("projetos")
    .update({ excluido: true, excluido_por: pessoaId })
    .eq("id", projetoId)

  if (error) throw new Error(error.message)

  await registrarLog(projetoId, pessoaId, "excluido")
}

export async function restaurarProjeto(projetoId: string, pessoaId: string) {
  const { error } = await supabase
    .from("projetos")
    .update({ excluido: false, excluido_por: null })
    .eq("id", projetoId)

  if (error) throw new Error(error.message)

  await registrarLog(projetoId, pessoaId, "restaurado")
}

/**
 * Remoção definitiva — só deve ser chamada a partir da aba
 * "Projetos Excluídos", conforme a especificação. Não há log
 * depois disso porque o projeto deixa de existir.
 */
export async function excluirDefinitivamente(projetoId: string) {
  const { error } = await supabase
    .from("projetos")
    .delete()
    .eq("id", projetoId)

  if (error) throw new Error(error.message)
}
