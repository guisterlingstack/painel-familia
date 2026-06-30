/**
 * Tipos que espelham as tabelas criadas no Supabase (Etapa 2).
 * Mantê-los atualizados aqui ajuda o TypeScript a "saber" o formato
 * dos dados em todo o projeto, evitando erros de digitação em nomes
 * de campos.
 */

export interface Pessoa {
  id: string
  nome: string
  codigo: string
  criado_em: string
}

export interface Status {
  id: string
  nome: string
  ordem: number
  criado_em: string
}

export interface Prioridade {
  id: string
  nome: string
  emoji: string | null
  ordem: number
  criado_em: string
}

export interface Categoria {
  id: string
  nome: string
  cor: string
  criado_em: string
}

export interface Projeto {
  id: string
  nome: string
  descricao: string | null
  status_id: string | null
  prioridade_id: string | null
  categoria_id: string | null
  arquivado: boolean
  excluido: boolean
  criado_por: string | null
  editado_por: string | null
  arquivado_por: string | null
  excluido_por: string | null
  criado_em: string
  atualizado_em: string
}

export interface ChecklistItem {
  id: string
  projeto_id: string
  texto: string
  concluido: boolean
  ordem: number
  criado_por: string | null
  criado_em: string
}

export interface ProjetoHorario {
  id: string
  projeto_id: string
  dia_semana: number // 0 = domingo ... 6 = sábado
  horario: string // formato "HH:MM:SS"
}

export interface LogAlteracao {
  id: string
  projeto_id: string | null
  pessoa_id: string | null
  acao: string
  detalhes: string | null
  criado_em: string
}
