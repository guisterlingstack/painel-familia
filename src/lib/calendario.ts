export const DIAS_SEMANA = [
  { id: 0, nome: "Domingo", abreviacao: "Dom" },
  { id: 1, nome: "Segunda", abreviacao: "Seg" },
  { id: 2, nome: "Terça", abreviacao: "Ter" },
  { id: 3, nome: "Quarta", abreviacao: "Qua" },
  { id: 4, nome: "Quinta", abreviacao: "Qui" },
  { id: 5, nome: "Sexta", abreviacao: "Sex" },
  { id: 6, nome: "Sábado", abreviacao: "Sáb" },
] as const

/**
 * Gera a lista de horários de 30 em 30 minutos, de 00:00 a 23:30,
 * no formato "HH:MM:SS" (compatível com o tipo `time` do banco).
 */
export function gerarFaixasHorario(): string[] {
  const faixas: string[] = []
  for (let hora = 0; hora < 24; hora++) {
    for (const minuto of [0, 30]) {
      const h = String(hora).padStart(2, "0")
      const m = String(minuto).padStart(2, "0")
      faixas.push(`${h}:${m}:00`)
    }
  }
  return faixas
}

/** Formata "HH:MM:SS" para exibição como "HH:MM". */
export function formatarHorarioCurto(horario: string): string {
  return horario.slice(0, 5)
}
