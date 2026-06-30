import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  gerarGradeMensal,
  nomeDoMes,
  moverMes,
  formatarDataCurta,
} from "@/lib/calendarioMensal"
import { gerarFaixasHorario, formatarHorarioCurto } from "@/lib/calendario"
import type { HorarioSelecionado } from "@/features/projetos/acoesHorarios"

const FAIXAS_HORARIO = gerarFaixasHorario()
const ABREV_DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

interface SeletorHorariosProps {
  selecionados: HorarioSelecionado[]
  onAlterar: (selecionados: HorarioSelecionado[]) => void
}

/**
 * Seletor de programação por datas reais do calendário: a pessoa
 * navega entre os meses, clica nas datas específicas desejadas
 * (ex: o sábado 04/07/2026, não "todo sábado"), e para cada data
 * marcada escolhe quais horários (de 30 em 30 min) o projeto ocupa
 * naquele dia específico.
 */
export function SeletorHorarios({
  selecionados,
  onAlterar,
}: SeletorHorariosProps) {
  const hoje = new Date()
  const [ano, setAno] = useState(hoje.getFullYear())
  const [mes, setMes] = useState(hoje.getMonth())
  const [dataFoco, setDataFoco] = useState<string | null>(null)

  const dias = gerarGradeMensal(ano, mes)
  const datasComHorario = new Set(selecionados.map((h) => h.data))

  function irParaMes(direcao: 1 | -1) {
    const novo = moverMes(ano, mes, direcao)
    setAno(novo.ano)
    setMes(novo.mes)
  }

  function alternarData(dataISO: string) {
    if (datasComHorario.has(dataISO)) {
      onAlterar(selecionados.filter((h) => h.data !== dataISO))
      if (dataFoco === dataISO) setDataFoco(null)
    } else {
      setDataFoco(dataISO)
    }
  }

  function alternarHorario(dataISO: string, horario: string) {
    const jaExiste = selecionados.some(
      (h) => h.data === dataISO && h.horario === horario
    )

    if (jaExiste) {
      onAlterar(
        selecionados.filter(
          (h) => !(h.data === dataISO && h.horario === horario)
        )
      )
    } else {
      onAlterar([...selecionados, { data: dataISO, horario }])
    }
  }

  const horariosDaDataFoco =
    dataFoco !== null
      ? selecionados.filter((h) => h.data === dataFoco)
      : []

  return (
    <div>
      {/* Navegação entre meses */}
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => irParaMes(-1)}
          className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
          aria-label="Mês anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="text-sm font-medium text-foreground">
          {nomeDoMes(mes)} {ano}
        </p>
        <button
          type="button"
          onClick={() => irParaMes(1)}
          className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
          aria-label="Próximo mês"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Grade do calendário */}
      <div className="mb-3 rounded-md border border-border p-2">
        <div className="mb-1 grid grid-cols-7 gap-1">
          {ABREV_DIAS.map((d) => (
            <div
              key={d}
              className="py-1 text-center text-[10px] font-medium text-muted-foreground"
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {dias.map((dia) => {
            const marcado = datasComHorario.has(dia.dataISO)
            const emFoco = dataFoco === dia.dataISO
            return (
              <button
                key={dia.dataISO}
                type="button"
                onClick={() => {
                  if (marcado) {
                    setDataFoco(emFoco ? null : dia.dataISO)
                  } else {
                    alternarData(dia.dataISO)
                  }
                }}
                className={`rounded-md py-1.5 text-xs font-medium transition-colors ${
                  !dia.ehDoMesAtual
                    ? "text-muted-foreground/40"
                    : marcado
                    ? "bg-primary text-primary-foreground"
                    : dia.ehHoje
                    ? "bg-secondary text-foreground"
                    : "text-foreground hover:bg-secondary"
                } ${emFoco ? "ring-2 ring-ring ring-offset-1" : ""}`}
              >
                {dia.diaDoMes}
              </button>
            )
          })}
        </div>
      </div>

      {/* Horários da data em foco */}
      {dataFoco !== null && (
        <div className="rounded-md border border-border bg-secondary/40 p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium text-foreground">
              Horários — {formatarDataCurta(dataFoco)}
              {horariosDaDataFoco.length > 0 &&
                ` (${horariosDaDataFoco.length} selecionado${
                  horariosDaDataFoco.length > 1 ? "s" : ""
                })`}
            </p>
            <button
              type="button"
              onClick={() => alternarData(dataFoco)}
              className="text-xs text-destructive hover:underline"
            >
              Remover data
            </button>
          </div>

          <div className="grid max-h-48 grid-cols-4 gap-1 overflow-y-auto sm:grid-cols-6">
            {FAIXAS_HORARIO.map((horario) => {
              const ativo = selecionados.some(
                (h) => h.data === dataFoco && h.horario === horario
              )
              return (
                <button
                  key={horario}
                  type="button"
                  onClick={() => alternarHorario(dataFoco, horario)}
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

      {/* Resumo das datas marcadas, fora do mês em exibição */}
      {selecionados.length > 0 && (
        <p className="mt-2 text-[11px] text-muted-foreground">
          {datasComHorario.size} data
          {datasComHorario.size > 1 ? "s" : ""} programada
          {datasComHorario.size > 1 ? "s" : ""} no total.
        </p>
      )}
    </div>
  )
}
