import type { DadosDashboard } from "@/features/dashboard/useDashboard"

interface CartaoNumeroProps {
  rotulo: string
  valor: number
}

function CartaoNumero({ rotulo, valor }: CartaoNumeroProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-2xl font-semibold tracking-tight text-foreground">
        {valor}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">{rotulo}</p>
    </div>
  )
}

export function DashboardResumo({
  dados,
  carregando,
}: {
  dados: DadosDashboard
  carregando: boolean
}) {
  if (carregando) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-[68px] animate-pulse rounded-lg border border-border bg-muted"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <CartaoNumero rotulo="Projetos ativos" valor={dados.projetosAtivos} />
      <CartaoNumero
        rotulo="Projetos arquivados"
        valor={dados.projetosArquivados}
      />
      <CartaoNumero
        rotulo="Projetos concluídos"
        valor={dados.projetosConcluidos}
      />
      <CartaoNumero
        rotulo="Projetos excluídos"
        valor={dados.projetosExcluidos}
      />
      <CartaoNumero
        rotulo="Itens concluídos"
        valor={dados.itensConcluidos}
      />
      <CartaoNumero rotulo="Itens pendentes" valor={dados.itensPendentes} />
    </div>
  )
}
