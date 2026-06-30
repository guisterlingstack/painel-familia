export interface DiaCalendario {
  data: Date
  dataISO: string // "YYYY-MM-DD", usado como chave e para salvar no banco
  diaDoMes: number
  ehDoMesAtual: boolean
  ehHoje: boolean
}

const NOMES_MES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
] as const

/** Converte uma Date para string "YYYY-MM-DD" usando o horário local (evita bug de fuso horário do toISOString). */
export function dataParaISO(data: Date): string {
  const ano = data.getFullYear()
  const mes = String(data.getMonth() + 1).padStart(2, "0")
  const dia = String(data.getDate()).padStart(2, "0")
  return `${ano}-${mes}-${dia}`
}

/**
 * Gera a grade completa de um mês para exibição em calendário,
 * incluindo os dias "de preenchimento" do mês anterior/seguinte
 * para completar as semanas (igual ao Google Agenda/Calendar).
 */
export function gerarGradeMensal(ano: number, mes: number): DiaCalendario[] {
  const hoje = new Date()
  const hojeISO = dataParaISO(hoje)

  const primeiroDiaDoMes = new Date(ano, mes, 1)
  const diaSemanaDoPrimeiro = primeiroDiaDoMes.getDay()

  const inicioGrade = new Date(ano, mes, 1 - diaSemanaDoPrimeiro)

  const dias: DiaCalendario[] = []
  for (let i = 0; i < 42; i++) {
    const data = new Date(inicioGrade)
    data.setDate(inicioGrade.getDate() + i)

    dias.push({
      data,
      dataISO: dataParaISO(data),
      diaDoMes: data.getDate(),
      ehDoMesAtual: data.getMonth() === mes,
      ehHoje: dataParaISO(data) === hojeISO,
    })
  }

  return dias
}

export function nomeDoMes(mes: number): string {
  return NOMES_MES[mes]
}

/** Move uma referência de mês/ano um mês para frente ou para trás. */
export function moverMes(
  ano: number,
  mes: number,
  direcao: 1 | -1
): { ano: number; mes: number } {
  const data = new Date(ano, mes + direcao, 1)
  return { ano: data.getFullYear(), mes: data.getMonth() }
}

/** Formata uma data ISO ("YYYY-MM-DD") para exibição "DD/MM". */
export function formatarDataCurta(dataISO: string): string {
  const [, mes, dia] = dataISO.split("-")
  return `${dia}/${mes}`
}

/** Formata uma data ISO para exibição "DD/MM/AAAA". */
export function formatarDataCompleta(dataISO: string): string {
  const [ano, mes, dia] = dataISO.split("-")
  return `${dia}/${mes}/${ano}`
}
