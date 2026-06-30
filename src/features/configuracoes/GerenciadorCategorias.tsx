import { useEffect, useState, type FormEvent } from "react"
import { Plus, X } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { Categoria } from "@/types/database"
import {
  criarCategoria,
  editarCorOpcao,
  editarNomeOpcao,
  excluirOpcao,
} from "@/features/configuracoes/acoesConfiguracoes"

/**
 * Gerenciador da lista de categorias: edição de nome e cor inline,
 * criação de novas categorias, e exclusão (bloqueada se algum
 * projeto estiver usando).
 */
export function GerenciadorCategorias() {
  const [lista, setLista] = useState<Categoria[]>([])
  const [novoNome, setNovoNome] = useState("")
  const [novaCor, setNovaCor] = useState("#6366f1")
  const [erro, setErro] = useState<string | null>(null)

  async function recarregar() {
    const { data } = await supabase
      .from("categorias")
      .select("*")
      .order("nome")
    setLista(data ?? [])
  }

  useEffect(() => {
    recarregar()
  }, [])

  async function handleEditarNome(id: string, nome: string) {
    if (!nome.trim()) return
    await editarNomeOpcao("categorias", id, nome.trim())
    recarregar()
  }

  async function handleEditarCor(id: string, cor: string) {
    await editarCorOpcao(id, cor)
    recarregar()
  }

  async function handleExcluir(id: string) {
    setErro(null)
    try {
      await excluirOpcao("categorias", id)
      recarregar()
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao excluir.")
    }
  }

  async function handleCriar(event: FormEvent) {
    event.preventDefault()
    if (!novoNome.trim()) return
    await criarCategoria(novoNome.trim(), novaCor)
    setNovoNome("")
    setNovaCor("#6366f1")
    recarregar()
  }

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h2 className="mb-3 text-sm font-semibold text-foreground">
        Categorias
      </h2>

      <ul className="mb-3 space-y-1.5">
        {lista.map((item) => (
          <li key={item.id} className="group flex items-center gap-2">
            <input
              type="color"
              defaultValue={item.cor}
              onChange={(e) => handleEditarCor(item.id, e.target.value)}
              className="h-7 w-7 shrink-0 cursor-pointer rounded border border-input bg-transparent p-0.5"
            />
            <input
              type="text"
              defaultValue={item.nome}
              onBlur={(e) => handleEditarNome(item.id, e.target.value)}
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
          type="color"
          value={novaCor}
          onChange={(e) => setNovaCor(e.target.value)}
          className="h-7 w-7 shrink-0 cursor-pointer rounded border border-input bg-transparent p-0.5"
        />
        <input
          type="text"
          value={novoNome}
          onChange={(e) => setNovoNome(e.target.value)}
          placeholder="Nova categoria..."
          className="flex-1 border-none bg-transparent px-0 py-1 text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </form>
    </div>
  )
}
