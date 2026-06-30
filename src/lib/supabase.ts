import { createClient } from "@supabase/supabase-js"

/**
 * Cliente central de conexão com o Supabase (nosso banco de dados).
 *
 * As duas variáveis abaixo (URL e chave) NÃO ficam escritas diretamente
 * aqui no código — elas vêm de um arquivo separado chamado ".env",
 * que nunca é enviado ao GitHub (ele está listado no .gitignore).
 *
 * Isso é uma boa prática mesmo quando a chave é "pública" (segura para
 * expor): mantém a configuração separada do código e facilita trocar
 * de ambiente (ex: banco de testes vs banco real) no futuro.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Variáveis de ambiente do Supabase não encontradas. " +
      "Verifique se o arquivo .env existe e contém VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY."
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)
