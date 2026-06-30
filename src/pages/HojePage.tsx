import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { usePessoa } from "@/contexts/PessoaContext"
import type { Status } from "@/types/database"

/**
 * Tela "Hoje" — primeira tela do sistema (tela inicial).
 *
 * Nesta Etapa 2, esta página faz um teste real de conexão com o
 * Supabase: ela busca a lista de status cadastrados no banco e
 * exibe na tela. Se os status aparecerem, a conexão está funcionando.
 *
 * Nas próximas etapas, vamos preencher esta tela com:
 * - data atual
 * - projetos do dia
 * - horários
 * - quem criou cada projeto
 * - dashboard resumido
 */
export function HojePage() {
  const { pessoa, sair } = usePessoa()
  const [statusList, setStatusList] = useState<Status[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    async function buscarStatus() {
      const { data, error } = await supabase
        .from("status")
        .select("*")
        .order("ordem")

      if (error) {
        setErro(error.message)
      } else {
        setStatusList(data ?? [])
      }
      setCarregando(false)
    }

    buscarStatus()
  }, [])

  const hoje = new Date()
  const dataFormatada = hoje.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground capitalize">
              {dataFormatada}
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
              Hoje
            </h1>
          </div>

          {pessoa && (
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">
                {pessoa.nome}
              </p>
              <button
                onClick={sair}
                className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
              >
                Sair
              </button>
            </div>
          )}
        </header>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-3 text-sm font-semibold text-foreground">
            Teste de conexão com o Supabase
          </h2>

          {carregando && (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          )}

          {erro && (
            <p className="text-sm text-destructive">
              Erro ao conectar: {erro}
            </p>
          )}

          {!carregando && !erro && (
            <>
              <p className="mb-3 text-sm text-muted-foreground">
                Conexão bem-sucedida. Status encontrados no banco de dados:
              </p>
              <ul className="space-y-1">
                {statusList.map((status) => (
                  <li
                    key={status.id}
                    className="text-sm text-foreground"
                  >
                    • {status.nome}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
