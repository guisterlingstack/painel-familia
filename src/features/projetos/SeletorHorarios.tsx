import { useState } from "react"
import { DIAS_SEMANA, gerarFaixasHorario, formatarHorarioCurto } from "@/lib/calendario"
import type { HorarioSelecionado } from "@/features/projetos/acoesHorarios"

const FAIXAS_HORARIO = gerarFaixasHorario()

interface SeletorHorariosProps {
  selecionados: HorarioSelecionado[]
  onAlterar: (selecionados: HorarioSelecionado[]) => void
}

/**
 * Seletor de programação semanal: a pessoa marca quais dias da
 * semana o projeto ocupa e, para cada dia marcado, escolhe quais
 * horários (de 30 em 30 min) ele ocupa naquele dia.
 *
 * Estado local: mantém um "dia em foco" para mostrar a grade de
 * horários daquele dia, evitando mostrar 7 grades de uma vez (o que
 * ficaria poluído visualmente).
 */
export function SeletorHorarios({
  selecionados,
  onAlterar,
}: SeletorHorariosProps) {
  const [diaFoco, setDiaFoco] = useState<number | null>(null)

  const diasComHorario = new Set(selecionados.map((h) => h.diaSemana))

  function alternarDia(dia: number) {
    if (diasComHorario.has(dia)) {
      // Remove todos os horários deste dia
      onAlterar(selecionados.filter((h) => h.diaSemana !== dia))
      if (diaFoco === dia) setDiaFoco(null)
    } else {
      // Marca o dia, sem horários ainda, e abre o foco para escolher
      setDiaFoco(dia)
    }
  }

  function alternarHorario(dia: number, horario: string) {
    const jaExiste = selecionados.some(
      (h) => h.diaSemana === dia && h.horario === horario
    )

    if (jaExiste) {
      onAlterar(
        selecionados.filter(
          (h) => !(h.diaSemana === dia && h.horario === horario)
        )
      )
    } else {
      onAlterar([...selecionados, { diaSemana: dia, horario }])
    }
  }

  const horariosDoDiaFoco =
    diaFoco !== null
      ? selecionados.filter((h) => h.diaSemana === diaFoco)
      : []

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        {DIAS_SEMANA.map((dia) => {
          const ativo = diasComHorario.has(dia.id)
          return (
            <button
              key={dia.id}
              type="button"
              onClick={() => {
                if (ativo) {
                  setDiaFoco(diaFoco === dia.id ? null : dia.id)
                } else {
                  alternarDia(dia.id)
                }
              }}
              className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                ativo
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              {dia.abreviacao}
            </button>
          )
        })}
      </div>

      {diaFoco !== null && (
        <div className="rounded-md border border-border bg-secondary/40 p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium text-foreground">
              Horários — {DIAS_SEMANA[diaFoco].nome}
              {horariosDoDiaFoco.length > 0 &&
                ` (${horariosDoDiaFoco.length} selecionado${
                  horariosDoDiaFoco.length > 1 ? "s" : ""
                })`}
            </p>
            <button
              type="button"
              onClick={() => alternarDia(diaFoco)}
              className="text-xs text-destructive hover:underline"
            >
              Remover dia
            </button>
          </div>

          <div className="grid max-h-48 grid-cols-4 gap-1 overflow-y-auto sm:grid-cols-6">
            {FAIXAS_HORARIO.map((horario) => {
              const ativo = selecionados.some(
                (h) => h.diaSemana === diaFoco && h.horario === horario
              )
              return (
                <button
                  key={horario}
                  type="button"
                  onClick={() => alternarHorario(diaFoco, horario)}
                  className={`rounded px-1.5 py-1 text-[11px] font-medium tabular-nums transition-colors ${
                    ativo
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {formatarHorarioCurto(horario)}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
