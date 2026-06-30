export interface DiaDaSemana {
  data: Date
  diaSemana: number // 0 = domingo ... 6 = sábado
  dataFormatada: string // "29/06"
  ehHoje: boolean
}

/**
 * Calcula os 7 dias de uma semana (domingo a sábado), a partir de
 * qualquer data de referência dentro dessa semana.
 *
 * Essa é a peça central que permite "converter a configuração
 * semanal abstrata (ex: toda Segunda) para o calendário real do
 * ano corrente": para cada dia retornado aqui, sabemos a data real
 * E o dia da semana, então conseguimos cruzar com os horários
 * programados (que só guardam o dia da semana, 0 a 6).
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
      diaSemana: i,
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
