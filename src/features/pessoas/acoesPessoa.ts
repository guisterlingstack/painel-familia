import { supabase } from "@/lib/supabase"
import { codigoValido, normalizarCodigo } from "@/lib/validacao"

/**
 * Atualiza nome e/ou código de uma pessoa cadastrada.
 * Só deve ser chamada a partir de uma área protegida por useEhAdmin().
 */
export async function editarPessoa(
  pessoaId: string,
  nome: string,
  codigo: string
) {
  const codigoFormatado = normalizarCodigo(codigo)

  if (!nome.trim()) {
    throw new Error("O nome não pode ficar em branco.")
  }

  if (!codigoValido(codigoFormatado)) {
    throw new Error("Código inválido. Use o formato: 1 letra + 2 números.")
  }

  const { error } = await supabase
    .from("pessoas")
    .update({ nome: nome.trim(), codigo: codigoFormatado })
    .eq("id", pessoaId)

  if (error) {
    if (error.message.includes("duplicate") || error.code === "23505") {
      throw new Error("Já existe outra pessoa com este código.")
    }
    throw new Error(error.message)
  }
}

/**
 * Exclui uma pessoa cadastrada.
 * Só deve ser chamada a partir de uma área protegida por useEhAdmin().
 *
 * Não bloqueia a exclusão mesmo que a pessoa já tenha criado
 * projetos — os registros de "criado_por" continuam existindo no
 * banco, apenas deixam de corresponder a uma pessoa cadastrada
 * (o nome simplesmente não aparece mais para preencher esse campo).
 */
export async function excluirPessoa(pessoaId: string) {
  const { error } = await supabase.from("pessoas").delete().eq("id", pessoaId)
  if (error) throw new Error(error.message)
}
