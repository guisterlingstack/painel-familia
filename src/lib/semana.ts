import { dataParaISO } from "@/lib/calendarioMensal"

export interface DiaDaSemana {
  data: Date
  dataISO: string // "YYYY-MM-DD"
  dataFormatada: string // "29/06"
  ehHoje: boolean
}

/**
 * Calcula os 7 dias de uma semana (domingo a sábado), a partir de
 * qualquer data de referência dentro dessa semana. Usado para montar
 * o cabeçalho da grade da Agenda com as datas reais da semana exibida.
 */
export function calcularDiasDaSemana(dataReferencia: Date): DiaDaSemana[] {
  const hoje = new Date()
  const hojeFormatado = hoje.toDateString()

  const diaSemanaReferencia = dataReferencia.getDay()
  const domingo = new Date(dataReferencia)
  domingo.setDate(dataReferencia.getDate() - diaSemanaReferencia)
  domingo.setHours(0, 0, 0, 0)

  const dias: DiaDaSemana[] = []
  for (let i = 0; i < 7; i++) {
    const data = new Date(domingo)
    data.setDate(domingo.getDate() + i)

    dias.push({
      data,
      dataISO: dataParaISO(data),
      dataFormatada: data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      }),
      ehHoje: data.toDateString() === hojeFormatado,
    })
  }

  return dias
}

/** Move uma data de referência uma semana para frente ou para trás. */
export function moverSemana(
  dataReferencia: Date,
  direcao: 1 | -1
): Date {
  const nova = new Date(dataReferencia)
  nova.setDate(nova.getDate() + direcao * 7)
  return nova
}

/** Formata o intervalo de uma semana, ex: "29/06 — 05/07/2026". */
export function formatarIntervaloSemana(dias: DiaDaSemana[]): string {
  if (dias.length === 0) return ""
  const primeiro = dias[0]
  const ultimo = dias[dias.length - 1]
  const ano = ultimo.data.getFullYear()
  return `${primeiro.dataFormatada} — ${ultimo.dataFormatada}/${ano}`
}
