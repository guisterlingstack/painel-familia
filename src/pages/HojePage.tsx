import { usePessoa } from "@/contexts/PessoaContext"
import { NavegacaoPrincipal } from "@/components/NavegacaoPrincipal"
import { useDashboard } from "@/features/dashboard/useDashboard"
import { useProjetosDoDia } from "@/features/dashboard/useProjetosDoDia"
import { DashboardResumo } from "@/features/dashboard/DashboardResumo"
import { ProjetosDoDiaLista } from "@/features/dashboard/ProjetosDoDiaLista"

/**
 * Tela "Hoje" — primeira tela do sistema (tela inicial).
 *
 * Mostra: data atual, projetos programados para hoje (com horário,
 * status e quem criou) e um dashboard resumido com números gerais
 * do sistema.
 *
 * Como ainda não existe uma forma de criar projetos pela interface
 * (isso chega na Etapa 5), as listas aparecem vazias por enquanto —
 * mas toda a estrutura já está pronta para os dados reais.
 */
export function HojePage() {
  const { pessoa, sair } = usePessoa()
  const { dados, carregando: carregandoDashboard } = useDashboard()
  const { projetosDoDia, carregando: carregandoProjetos } =
    useProjetosDoDia()

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

        <NavegacaoPrincipal />

        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold text-foreground">
            Projetos de hoje
          </h2>
          <ProjetosDoDiaLista
            projetosDoDia={projetosDoDia}
            carregando={carregandoProjetos}
          />
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-foreground">
            Resumo
          </h2>
          <DashboardResumo
            dados={dados}
            carregando={carregandoDashboard}
          />
        </section>
      </div>
    </div>
  )
}
