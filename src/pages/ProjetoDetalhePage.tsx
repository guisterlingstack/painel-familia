import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

/**
 * Placeholder temporário da tela de Detalhe do Projeto.
 * Esta tela será construída de verdade na Etapa 6 (descrição,
 * checklist, prioridade, categoria, status, dias da semana,
 * horários, criado por, e os botões Arquivar/Excluir).
 */
export function ProjetoDetalhePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <button
          onClick={() => navigate("/projetos")}
          className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Projetos
        </button>

        <div className="rounded-lg border border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Detalhe do projeto (ID: {id}) será construído na Etapa 6.
          </p>
        </div>
      </div>
    </div>
  )
}
