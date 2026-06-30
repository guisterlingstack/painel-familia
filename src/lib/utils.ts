import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combina classes do Tailwind de forma segura, evitando conflitos
 * (ex: "p-2 p-4" vira só "p-4"). Usado por todos os componentes
 * de UI (botões, cards, etc.) que vamos adicionar nas próximas etapas.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
