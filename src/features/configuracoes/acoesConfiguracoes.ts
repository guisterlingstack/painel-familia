import { supabase } from "@/lib/supabase"

export type TabelaConfiguravel = "status" | "prioridades" | "categorias"

/**
 * Verifica quantos projetos usam um determinado status, prioridade
 * ou categoria. Usado para bloquear a exclusão de itens em uso.
 */
export async function contarProjetosUsando(
  tabela: TabelaConfiguravel,
  id: string
): Promise<number> {
  const coluna =
    tabela === "status"
      ? "status_id"
      : tabela === "prioridades"
      ? "prioridade_id"
      : "categoria_id"

  const { count, error } = await supabase
    .from("projetos")
    .select("id", { count: "exact", head: true })
    .eq(coluna, id)

  if (error) return 0
  return count ?? 0
}

export async function excluirOpcao(tabela: TabelaConfiguravel, id: string) {
  const emUso = await contarProjetosUsando(tabela, id)

  if (emUso > 0) {
    throw new Error(
      `Não é possível excluir: ${emUso} projeto${
        emUso > 1 ? "s estão usando este item" : " está usando este item"
      }.`
    )
  }

  const { error } = await supabase.from(tabela).delete().eq("id", id)
  if (error) throw new Error(error.message)
}

export async function editarNomeOpcao(
  tabela: TabelaConfiguravel,
  id: string,
  nome: string
) {
  const { error } = await supabase.from(tabela).update({ nome }).eq("id", id)
  if (error) throw new Error(error.message)
}

export async function editarEmojiOpcao(id: string, emoji: string) {
  const { error } = await supabase
    .from("prioridades")
    .update({ emoji })
    .eq("id", id)
  if (error) throw new Error(error.message)
}

export async function editarCorOpcao(id: string, cor: string) {
  const { error } = await supabase
    .from("categorias")
    .update({ cor })
    .eq("id", id)
  if (error) throw new Error(error.message)
}

export async function criarStatus(nome: string, ordem: number) {
  const { error } = await supabase.from("status").insert({ nome, ordem })
  if (error) throw new Error(error.message)
}

export async function criarPrioridade(
  nome: string,
  emoji: string,
  ordem: number
) {
  const { error } = await supabase
    .from("prioridades")
    .insert({ nome, emoji, ordem })
  if (error) throw new Error(error.message)
}

export async function criarCategoria(nome: string, cor: string) {
  const { error } = await supabase.from("categorias").insert({ nome, cor })
  if (error) throw new Error(error.message)
}
