import { useState } from "react"
import { Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { usePessoa } from "@/contexts/PessoaContext"
import { useProjetos, type AbaProjetos } from "@/features/projetos/useProjetos"
import { ProjetoCard } from "@/features/projetos/ProjetoCard"
import { NovoProjetoDialog } from "@/features/projetos/NovoProjetoDialog"
import {
  duplicarProjeto,
  arquivarProjeto,
  desarquivarProjeto,
  excluirProjeto,
  restaurarProjeto,
  excluirDefinitivamente,
} from "@/features/projetos/acoesProjeto"

const ABAS: { id: AbaProjetos; rotulo: string }[] = [
  { id: "ativos", rotulo: "Ativos" },
  { id: "arquivados", rotulo: "Arquivados" },
  { id: "excluidos", rotulo: "Excluídos" },
]

/**
 * Tela de Projetos — visual em grade no estilo Notion.
 * Permite criar, duplicar, arquivar e excluir projetos, com abas
 * separadas para Ativos, Arquivados e Excluídos.
 */
export function ProjetosPage() {
  const navigate = useNavigate()
  const { pessoa } = usePessoa()
  const [aba, setAba] = useState<AbaProjetos>("ativos")
  const [dialogAberto, setDialogAberto] = useState(false)

  const { projetos, carregando, recarregar } = useProjetos(aba)

  async function executarAcao(
    acao: (id: string, pessoaId: string) => Promise<void>,
    projetoId: string
  ) {
    if (!pessoa) return
    try {
      await acao(projetoId, pessoa.id)
      recarregar()
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erro ao executar ação.")
    }
  }

  async function handleDuplicar(projetoId: string) {
    if (!pessoa) return
    try {
      await duplicarProjeto(projetoId, pessoa.id)
      recarregar()
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erro ao duplicar projeto.")
    }
  }

  async function handleExcluirDefinitivamente(projetoId: string) {
    const confirmado = window.confirm(
      "Excluir definitivamente este projeto? Esta ação não pode ser desfeita."
    )
    if (!confirmado) return

    try {
      await excluirDefinitivamente(projetoId)
      recarregar()
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erro ao excluir definitivamente.")
    }
  }

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Projetos
          </h1>
          <button
            onClick={() => setDialogAberto(true)}
            className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Novo projeto
          </button>
        </header>

        <div className="mb-6 flex gap-1 border-b border-border">
          {ABAS.map((item) => (
            <button
              key={item.id}
              onClick={() => setAba(item.id)}
              className={`border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
                aba === item.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.rotulo}
            </button>
          ))}
        </div>

        {carregando && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-lg border border-border bg-muted"
              />
            ))}
          </div>
        )}

        {!carregando && projetos.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-10 text-center">
            <p className="text-sm text-muted-foreground">
              {aba === "ativos" &&
                "Nenhum projeto ainda. Crie o primeiro clicando em \"Novo projeto\"."}
              {aba === "arquivados" && "Nenhum projeto arquivado."}
              {aba === "excluidos" && "Nenhum projeto excluído."}
            </p>
          </div>
        )}

        {!carregando && projetos.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {projetos.map((projeto) => (
              <ProjetoCard
                key={projeto.id}
                projeto={projeto}
                aba={aba}
                onAbrir={(id) => navigate(`/projetos/${id}`)}
                onDuplicar={handleDuplicar}
                onArquivar={(id) => executarAcao(arquivarProjeto, id)}
                onDesarquivar={(id) => executarAcao(desarquivarProjeto, id)}
                onExcluir={(id) => executarAcao(excluirProjeto, id)}
                onRestaurar={(id) => executarAcao(restaurarProjeto, id)}
                onExcluirDefinitivamente={handleExcluirDefinitivamente}
              />
            ))}
          </div>
        )}
      </div>

      <NovoProjetoDialog
        aberto={dialogAberto}
        onFechar={() => setDialogAberto(false)}
        onCriado={recarregar}
      />
    </div>
  )
}
