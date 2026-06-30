import { useEffect, useState, type FormEvent } from "react"
import { Plus, X } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { Status } from "@/types/database"
import {
  criarStatus,
  editarNomeOpcao,
  excluirOpcao,
} from "@/features/configuracoes/acoesConfiguracoes"

/**
 * Gerenciador da lista de status: edição de nome inline, criação de
 * novos status, e exclusão (bloqueada se algum projeto estiver usando).
 */
export function GerenciadorStatus() {
  const [lista, setLista] = useState<Status[]>([])
  const [novoNome, setNovoNome] = useState("")
  const [erro, setErro] = useState<string | null>(null)

  async function recarregar() {
    const { data } = await supabase.from("status").select("*").order("ordem")
    setLista(data ?? [])
  }

  useEffect(() => {
    recarregar()
  }, [])

  async function handleEditar(id: string, nome: string) {
    if (!nome.trim()) return
    await editarNomeOpcao("status", id, nome.trim())
    recarregar()
  }

  async function handleExcluir(id: string) {
    setErro(null)
    try {
      await excluirOpcao("status", id)
      recarregar()
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao excluir.")
    }
  }

  async function handleCriar(event: FormEvent) {
    event.preventDefault()
    if (!novoNome.trim()) return
    await criarStatus(novoNome.trim(), lista.length + 1)
    setNovoNome("")
    recarregar()
  }

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h2 className="mb-3 text-sm font-semibold text-foreground">Status</h2>

      <ul className="mb-3 space-y-1.5">
        {lista.map((item) => (
          <li key={item.id} className="group flex items-center gap-2">
            <input
              type="text"
              defaultValue={item.nome}
              onBlur={(e) => handleEditar(item.id, e.target.value)}
              className="flex-1 rounded-md border border-transparent bg-transparent px-2 py-1.5 text-sm text-foreground outline-none hover:border-input focus:border-input focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button
              onClick={() => handleExcluir(item.id)}
              className="shrink-0 text-muted-foreground opacity-0 hover:text-destructive group-hover:opacity-100"
              aria-label="Excluir"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </li>
        ))}
      </ul>

      {erro && <p className="mb-2 text-xs text-destructive">{erro}</p>}

      <form onSubmit={handleCriar} className="flex items-center gap-2">
        <Plus className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <input
          type="text"
          value={novoNome}
          onChange={(e) => setNovoNome(e.target.value)}
          placeholder="Novo status..."
          className="flex-1 border-none bg-transparent px-0 py-1 text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </form>
    </div>
  )
}
