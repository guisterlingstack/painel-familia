/**
 * Valida o formato do código de identificação pessoal.
 * Formato esperado: 1 letra + 2 números (ex: G26, M29, J74).
 */
export function codigoValido(codigo: string): boolean {
  return /^[A-Za-z][0-9]{2}$/.test(codigo.trim())
}

/**
 * Normaliza o código para o formato padrão do sistema:
 * letra maiúscula + 2 números, sem espaços.
 */
export function normalizarCodigo(codigo: string): string {
  return codigo.trim().toUpperCase()
}
