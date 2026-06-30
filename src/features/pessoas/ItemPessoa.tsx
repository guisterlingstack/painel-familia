import { useState } from "react"
import { Pencil, Trash2, X, Check } from "lucide-react"
import { codigoValido, normalizarCodigo } from "@/lib/validacao"
import type { Pessoa } from "@/types/database"

interface ItemPessoaProps {
  pessoa: Pessoa
  ehEuMesmo: boolean
  podeGerenciar: boolean
  onEditar: (id: string, nome: string, codigo: string) => Promise<void>
  onExcluir: (id: string) => void
}

/**
 * Item da lista de pessoas cadastradas. Quando `podeGerenciar` é
 * verdadeiro (somente para o administrador, ver useEhAdmin), exibe
 * botões de editar e excluir — exceto na própria linha do
 * administrador, já que não faz sentido se autoexcluir por aqui.
 */
export function ItemPessoa({
  pessoa,
  ehEuMesmo,
  podeGerenciar,
  onEditar,
  onExcluir,
}: ItemPessoaProps) {
  const [editando, setEditando] = useState(false)
  const [nome, setNome] = useState(pessoa.nome)
  const [codigo, setCodigo] = useState(pessoa.codigo)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  function cancelar() {
    setNome(pessoa.nome)
    setCodigo(pessoa.codigo)
    setErro(null)
    setEditando(false)
  }

  async function salvar() {
    setErro(null)

    if (!nome.trim()) {
      setErro("Nome não pode ficar em branco.")
      return
    }
    if (!codigoValido(codigo)) {
      setErro("Código inválido (ex: G26).")
      return
    }

    setSalvando(true)
    try {
      await onEditar(pessoa.id, nome.trim(), normalizarCodigo(codigo))
      setEditando(false)
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao salvar.")
    } finally {
      setSalvando(false)
    }
  }

  if (editando) {
    return (
      <li className="space-y-2 py-2.5">
        <div className="flex gap-2">
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="flex-1 rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            autoFocus
          />
          <input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            maxLength={3}
            className="w-20 rounded-md border border-input bg-background px-2 py-1.5 text-sm uppercase text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            onClick={salvar}
            disabled={salvando}
            className="shrink-0 rounded-md p-1.5 text-primary hover:bg-secondary disabled:opacity-60"
            aria-label="Salvar"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={cancelar}
            className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-secondary"
            aria-label="Cancelar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {erro && <p className="text-xs text-destructive">{erro}</p>}
      </li>
    )
  }

  return (
    <li className="group flex items-center justify-between py-2.5">
      <span className="text-sm text-foreground">
        {pessoa.nome}
        {ehEuMesmo && (
          <span className="ml-2 text-xs text-muted-foreground">(você)</span>
        )}
      </span>

      <div className="flex items-center gap-2">
        <span className="rounded bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
          {pessoa.codigo}
        </span>

        {podeGerenciar && !ehEuMesmo && (
          <>
            <button
              onClick={() => setEditando(true)}
              className="text-muted-foreground opacity-0 hover:text-foreground group-hover:opacity-100"
              aria-label="Editar"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onExcluir(pessoa.id)}
              className="text-muted-foreground opacity-0 hover:text-destructive group-hover:opacity-100"
              aria-label="Excluir"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      </div>
    </li>
  )
}
