import { useEffect, useState, type FormEvent } from "react"
import { supabase } from "@/lib/supabase"
import { codigoValido, normalizarCodigo } from "@/lib/validacao"
import { usePessoa } from "@/contexts/PessoaContext"
import { useEhAdmin } from "@/features/pessoas/useEhAdmin"
import { editarPessoa, excluirPessoa } from "@/features/pessoas/acoesPessoa"
import { ItemPessoa } from "@/features/pessoas/ItemPessoa"
import { NavegacaoPrincipal } from "@/components/NavegacaoPrincipal"
import type { Pessoa } from "@/types/database"

/**
 * Tela de Cadastro de Pessoas.
 *
 * Permite adicionar novos moradores (nome + código) e mostra a lista
 * de pessoas já cadastradas. Esta tela não exige identificação prévia
 * de propósito: é o ponto de partida para cadastrar a primeira pessoa
 * da casa, antes de existir qualquer um "logado".
 */
export function PessoasPage() {
  const { pessoa } = usePessoa()
  const ehAdmin = useEhAdmin()
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [carregando, setCarregando] = useState(true)

  const [nome, setNome] = useState("")
  const [codigo, setCodigo] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function buscarPessoas() {
    const { data, error } = await supabase
      .from("pessoas")
      .select("*")
      .order("nome")

    if (!error) {
      setPessoas(data ?? [])
    }
    setCarregando(false)
  }

  useEffect(() => {
    buscarPessoas()
  }, [])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setErro(null)

    if (!nome.trim()) {
      setErro("Informe o nome.")
      return
    }

    if (!codigoValido(codigo)) {
      setErro("Código inválido. Use o formato: 1 letra + 2 números (ex: G26).")
      return
    }

    const codigoFormatado = normalizarCodigo(codigo)

    if (pessoas.some((p) => p.codigo === codigoFormatado)) {
      setErro("Já existe uma pessoa cadastrada com este código.")
      return
    }

    setEnviando(true)

    const { error } = await supabase
      .from("pessoas")
      .insert({ nome: nome.trim(), codigo: codigoFormatado })

    setEnviando(false)

    if (error) {
      setErro("Erro ao cadastrar. Tente novamente.")
      return
    }

    setNome("")
    setCodigo("")
    buscarPessoas()
  }

  async function handleEditarPessoa(id: string, nome: string, codigo: string) {
    await editarPessoa(id, nome, codigo)
    buscarPessoas()
  }

  async function handleExcluirPessoa(id: string, nomePessoa: string) {
    const confirmado = window.confirm(
      `Excluir o cadastro de "${nomePessoa}"? Esta ação não pode ser desfeita. ` +
        `Projetos já criados por essa pessoa não serão apagados.`
    )
    if (!confirmado) return

    try {
      await excluirPessoa(id)
      buscarPessoas()
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erro ao excluir pessoa.")
    }
  }

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-2xl">
        {pessoa && <NavegacaoPrincipal />}

        <header className="mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Pessoas
            </h1>
            {ehAdmin && (
              <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                Modo administrador
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Cadastre os moradores que poderão usar o sistema.
            {ehAdmin &&
              " Como administrador, você pode editar e excluir os cadastros existentes."}
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-lg border border-border bg-card p-6"
        >
          <h2 className="mb-4 text-sm font-semibold text-foreground">
            Nova pessoa
          </h2>

          <div className="mb-4 flex gap-3">
            <div className="flex-1">
              <label
                htmlFor="nome"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Nome
              </label>
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome completo"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                autoComplete="off"
              />
            </div>

            <div className="w-28">
              <label
                htmlFor="codigo"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Código
              </label>
              <input
                id="codigo"
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="G26"
                maxLength={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm uppercase text-foreground outline-none placeholder:text-muted-foreground placeholder:normal-case focus-visible:ring-2 focus-visible:ring-ring"
                autoComplete="off"
              />
            </div>
          </div>

          {erro && <p className="mb-4 text-sm text-destructive">{erro}</p>}

          <button
            type="submit"
            disabled={enviando}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {enviando ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-sm font-semibold text-foreground">
            Pessoas cadastradas
          </h2>

          {carregando && (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          )}

          {!carregando && pessoas.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhuma pessoa cadastrada ainda.
            </p>
          )}

          {!carregando && pessoas.length > 0 && (
            <ul className="divide-y divide-border">
              {pessoas.map((p) => (
                <ItemPessoa
                  key={p.id}
                  pessoa={p}
                  ehEuMesmo={pessoa?.id === p.id}
                  podeGerenciar={ehAdmin}
                  onEditar={handleEditarPessoa}
                  onExcluir={(id) => handleExcluirPessoa(id, p.nome)}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
