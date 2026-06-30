import { useState, type FormEvent } from "react"
import { Plus, X } from "lucide-react"
import type { ChecklistItem } from "@/types/database"
import {
  adicionarItemChecklist,
  alternarItemChecklist,
  editarTextoItemChecklist,
  excluirItemChecklist,
} from "@/features/projetos/acoesChecklist"

interface ChecklistProjetoProps {
  projetoId: string
  itens: ChecklistItem[]
  pessoaId: string
  onAlterado: () => void
}

/**
 * Checklist do projeto: lista de itens com checkbox, edição de texto
 * inline (clique no texto para editar) e exclusão. Permite adicionar
 * quantos itens forem necessários, sem limite — conforme especificado.
 */
export function ChecklistProjeto({
  projetoId,
  itens,
  pessoaId,
  onAlterado,
}: ChecklistProjetoProps) {
  const [novoTexto, setNovoTexto] = useState("")
  const [itemEditando, setItemEditando] = useState<string | null>(null)
  const [textoEditando, setTextoEditando] = useState("")

  async function handleAdicionar(event: FormEvent) {
    event.preventDefault()
    if (!novoTexto.trim()) return

    const proximaOrdem = itens.length
    await adicionarItemChecklist(
      projetoId,
      novoTexto.trim(),
      pessoaId,
      proximaOrdem
    )
    setNovoTexto("")
    onAlterado()
  }

  async function handleAlternar(item: ChecklistItem) {
    await alternarItemChecklist(item.id, !item.concluido)
    onAlterado()
  }

  function iniciarEdicao(item: ChecklistItem) {
    setItemEditando(item.id)
    setTextoEditando(item.texto)
  }

  async function salvarEdicao(itemId: string) {
    if (textoEditando.trim()) {
      await editarTextoItemChecklist(itemId, textoEditando.trim())
      onAlterado()
    }
    setItemEditando(null)
  }

  async function handleExcluir(itemId: string) {
    await excluirItemChecklist(itemId)
    onAlterado()
  }

  return (
    <div>
      {itens.length > 0 && (
        <ul className="mb-3 space-y-1.5">
          {itens.map((item) => (
            <li
              key={item.id}
              className="group flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-secondary/50"
            >
              <input
                type="checkbox"
                checked={item.concluido}
                onChange={() => handleAlternar(item)}
                className="h-4 w-4 shrink-0 cursor-pointer rounded border-input"
              />

              {itemEditando === item.id ? (
                <input
                  type="text"
                  value={textoEditando}
                  onChange={(e) => setTextoEditando(e.target.value)}
                  onBlur={() => salvarEdicao(item.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") salvarEdicao(item.id)
                    if (e.key === "Escape") setItemEditando(null)
                  }}
                  autoFocus
                  className="flex-1 rounded border border-input bg-background px-1.5 py-0.5 text-sm text-foreground outline-none"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => iniciarEdicao(item)}
                  className={`flex-1 text-left text-sm ${
                    item.concluido
                      ? "text-muted-foreground line-through"
                      : "text-foreground"
                  }`}
                >
                  {item.texto}
                </button>
              )}

              <button
                type="button"
                onClick={() => handleExcluir(item.id)}
                className="shrink-0 text-muted-foreground opacity-0 hover:text-destructive group-hover:opacity-100"
                aria-label="Excluir item"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAdicionar} className="flex items-center gap-2">
        <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          type="text"
          value={novoTexto}
          onChange={(e) => setNovoTexto(e.target.value)}
          placeholder="Adicionar item..."
          className="flex-1 border-none bg-transparent px-0 py-1 text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </form>
    </div>
  )
}
