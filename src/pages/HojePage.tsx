/**
 * Tela "Hoje" — primeira tela do sistema (tela inicial).
 *
 * Nesta Etapa 1, esta página é apenas um placeholder para confirmarmos
 * que toda a infraestrutura (React + Vite + TypeScript + Tailwind +
 * roteamento) está funcionando corretamente.
 *
 * Nas próximas etapas, vamos preencher esta tela com:
 * - data atual
 * - projetos do dia
 * - horários
 * - quem criou cada projeto
 * - dashboard resumido
 */
export function HojePage() {
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
        <header className="mb-8">
          <p className="text-sm font-medium text-muted-foreground capitalize">
            {dataFormatada}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
            Hoje
          </h1>
        </header>

        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Etapa 1 concluída: o projeto está rodando corretamente. As
            próximas etapas vão preencher esta tela com os projetos do dia,
            horários e o dashboard resumido.
          </p>
        </div>
      </div>
    </div>
  )
}
