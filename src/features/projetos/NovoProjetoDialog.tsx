import { useState, type FormEvent } from "react"
import { X } from "lucide-react"
import { useOpcoesProjeto } from "@/features/projetos/useOpcoesProjeto"
import { criarProjeto } from "@/features/projetos/acoesProjeto"
import { usePessoa } from "@/contexts/PessoaContext"

interface NovoProjetoDialogProps {
  aberto: boolean
  onFechar: () => void
  onCriado: () => void
}

/**
 * Formulário de criação de um novo projeto.
 *
 * Conforme a especificação: descrição e checklist são opcionais e
 * independentes (o usuário pode usar só descrição, só checklist,
 * ambos, ou nenhum). Por isso, nesta etapa, o checklist é gerenciado
 * dentro do detalhe do projeto (Etapa 6) — aqui criamos só os campos
 * principais e, opcionalmente, a descrição.
 */
export function NovoProjetoDialog({
  aberto,
  onFechar,
  onCriado,
}: NovoProjetoDialogProps) {
  const { pessoa } = usePessoa()
  const { statusList, prioridadesList, categoriasList } = useOpcoesProjeto()

  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [statusId, setStatusId] = useState("")
  const [prioridadeId, setPrioridadeId] = useState("")
  const [categoriaId, setCategoriaId] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  if (!aberto) return null

  function fecharEResetar() {
    setNome("")
    setDescricao("")
    setStatusId("")
    setPrioridadeId("")
    setCategoriaId("")
    setErro(null)
    onFechar()
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setErro(null)

    if (!nome.trim()) {
      setErro("Informe o nome do projeto.")
      return
    }

    if (!pessoa) {
      setErro("Não foi possível identificar quem está criando o projeto.")
      return
    }

    setEnviando(true)
    try {
      await criarProjeto({
        nome: nome.trim(),
        descricao: descricao.trim() || null,
        statusId: statusId || null,
        prioridadeId: prioridadeId || null,
        categoriaId: categoriaId || null,
        criadoPor: pessoa.id,
      })
      fecharEResetar()
      onCriado()
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao criar projeto.")
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">
            Novo projeto
          </h2>
          <button
            onClick={fecharEResetar}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Nome
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Organizar quarto"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              autoFocus
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Descrição (opcional)
            </label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              placeholder="Detalhes sobre o projeto..."
              className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Status
              </label>
              <select
                value={statusId}
                onChange={(e) => setStatusId(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-2 py-2 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">—</option>
                {statusList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Prioridade
              </label>
              <select
                value={prioridadeId}
                onChange={(e) => setPrioridadeId(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-2 py-2 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">—</option>
                {prioridadesList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.emoji} {p.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Categoria
              </label>
              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-2 py-2 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">—</option>
                {categoriasList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {erro && <p className="text-sm text-destructive">{erro}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={fecharEResetar}
              className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {enviando ? "Criando..." : "Criar projeto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
