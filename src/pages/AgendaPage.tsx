import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  calcularDiasDaSemana,
  formatarIntervaloSemana,
  moverSemana,
} from "@/lib/semana"
import { useAgenda } from "@/features/agenda/useAgenda"
import { GradeAgenda } from "@/features/agenda/GradeAgenda"
import { NavegacaoPrincipal } from "@/components/NavegacaoPrincipal"

/**
 * Tela de Agenda — visual estilo Google Agenda, exibindo a semana
 * corrente (ou outra semana navegada) com os projetos programados
 * convertidos para datas reais.
 */
export function AgendaPage() {
  const [dataReferencia, setDataReferencia] = useState(new Date())
  const { eventos, carregando } = useAgenda()

  const dias = calcularDiasDaSemana(dataReferencia)
  const intervalo = formatarIntervaloSemana(dias)

  function irParaHoje() {
    setDataReferencia(new Date())
  }

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <NavegacaoPrincipal />

        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Agenda
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {intervalo}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-md border border-input">
              <button
                onClick={() =>
                  setDataReferencia((d) => moverSemana(d, -1))
                }
                className="rounded-l-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                aria-label="Semana anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={irParaHoje}
                className="border-x border-input px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary"
              >
                Hoje
              </button>
              <button
                onClick={() => setDataReferencia((d) => moverSemana(d, 1))}
                className="rounded-r-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                aria-label="Próxima semana"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        {carregando ? (
          <div className="h-96 animate-pulse rounded-lg border border-border bg-muted" />
        ) : (
          <GradeAgenda dias={dias} eventos={eventos} />
        )}
      </div>
    </div>
  )
}
