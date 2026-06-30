import { usePessoa } from "@/contexts/PessoaContext"

/**
 * Identifica o administrador do sistema: apenas Guilherme Augusto
 * Ribeiro, com o código G28.
 *
 * Esta é uma exceção pontual e não um sistema de papéis/permissões
 * genérico — a especificação original do sistema não prevê níveis
 * de acesso, então mantemos essa checagem isolada e simples, usada
 * apenas onde for explicitamente necessário (edição/exclusão de
 * outras pessoas cadastradas).
 *
 * Atenção: esta verificação acontece no frontend, como proteção de
 * interface (evita uso casual por engano pelos demais moradores).
 * Como o sistema usa uma chave pública compartilhada sem senha
 * individual, ela não é uma barreira de segurança contra acesso
 * direto à API — adequado para o uso doméstico privado deste sistema.
 */
const CODIGO_ADMIN = "G28"
const NOME_ADMIN = "Guilherme Augusto Ribeiro"

export function useEhAdmin(): boolean {
  const { pessoa } = usePessoa()

  if (!pessoa) return false

  return (
    pessoa.codigo === CODIGO_ADMIN &&
    pessoa.nome.trim().toLowerCase() === NOME_ADMIN.toLowerCase()
  )
}
