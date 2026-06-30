import type { ProjetoDoDia } from "@/features/dashboard/useProjetosDoDia"

/**
 * Formata um horário no formato "HH:MM:SS" vindo do banco
 * para exibição como "HH:MM".
 */
function formatarHorario(horario: string): string {
  return horario.slice(0, 5)
}

export function ProjetosDoDiaLista({
  projetosDoDia,
  carregando,
}: {
  projetosDoDia: ProjetoDoDia[]
  carregando: boolean
}) {
  if (carregando) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-14 animate-pulse rounded-lg border border-border bg-muted"
          />
        ))}
      </div>
    )
  }

  if (projetosDoDia.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Nenhum projeto programado para hoje.
        </p>
      </div>
    )
  }

  return (
    <ul className="space-y-2">
      {projetosDoDia.map((item) => (
        <li
          key={item.horarioId}
          className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
        >
          <span
            className="h-8 w-1 shrink-0 rounded-full"
            style={{ backgroundColor: item.corCategoria ?? "#94a3b8" }}
          />

          <span className="w-12 shrink-0 text-sm font-medium tabular-nums text-muted-foreground">
            {formatarHorario(item.horario)}
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {item.nomeProjeto}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {item.nomeStatus ?? "Sem status"}
              {item.nomeCriador && ` · criado por ${item.nomeCriador}`}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}
