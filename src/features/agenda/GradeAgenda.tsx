import { useNavigate } from "react-router-dom"
import { DIAS_SEMANA, gerarFaixasHorario, formatarHorarioCurto } from "@/lib/calendario"
import type { DiaDaSemana } from "@/lib/semana"
import type { EventoAgenda } from "@/features/agenda/useAgenda"

const FAIXAS_HORARIO = gerarFaixasHorario()
const ALTURA_LINHA = 28 // px, altura de cada faixa de 30 min

interface GradeAgendaProps {
  dias: DiaDaSemana[]
  eventos: EventoAgenda[]
}

/**
 * Grade visual da agenda: colunas = dias da semana (com data real),
 * linhas = horários de 30 em 30 min. Eventos que ocupam o mesmo
 * dia + horário (sobreposição, permitida pela especificação) são
 * exibidos lado a lado dentro da mesma célula de tempo.
 */
export function GradeAgenda({ dias, eventos }: GradeAgendaProps) {
  const navigate = useNavigate()

  function eventosDoSlot(diaSemana: number, horario: string) {
    return eventos.filter(
      (e) => e.diaSemana === diaSemana && e.horario === horario
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <div className="min-w-[700px]">
        {/* Cabeçalho com os dias */}
        <div className="grid grid-cols-[56px_repeat(7,1fr)] border-b border-border bg-card">
          <div />
          {dias.map((dia) => (
            <div
              key={dia.diaSemana}
              className={`border-l border-border px-2 py-2 text-center ${
                dia.ehHoje ? "bg-primary/5" : ""
              }`}
            >
              <p className="text-[11px] font-medium text-muted-foreground">
                {DIAS_SEMANA[dia.diaSemana].abreviacao}
              </p>
              <p
                className={`text-sm font-semibold tabular-nums ${
                  dia.ehHoje ? "text-primary" : "text-foreground"
                }`}
              >
                {dia.dataFormatada}
              </p>
            </div>
          ))}
        </div>

        {/* Linhas de horário */}
        <div className="relative">
          {FAIXAS_HORARIO.map((horario) => (
            <div
              key={horario}
              className="grid grid-cols-[56px_repeat(7,1fr)] border-b border-border/60"
              style={{ height: ALTURA_LINHA }}
            >
              <div className="flex items-start justify-end pr-2 text-[10px] text-muted-foreground">
                {horario.endsWith(":00:00") && (
                  <span className="-translate-y-1.5 tabular-nums">
                    {formatarHorarioCurto(horario)}
                  </span>
                )}
              </div>

              {dias.map((dia) => {
                const slot = eventosDoSlot(dia.diaSemana, horario)
                return (
                  <div
                    key={dia.diaSemana}
                    className={`flex gap-px border-l border-border/60 p-px ${
                      dia.ehHoje ? "bg-primary/5" : ""
                    }`}
                  >
                    {slot.map((evento) => (
                      <button
                        key={evento.horarioId}
                        onClick={() => navigate(`/projetos/${evento.projetoId}`)}
                        title={evento.nomeProjeto}
                        className="flex-1 truncate rounded-sm px-1 text-left text-[10px] font-medium text-white"
                        style={{
                          backgroundColor: evento.corCategoria ?? "#94a3b8",
                        }}
                      >
                        {evento.nomeProjeto}
                      </button>
                    ))}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
