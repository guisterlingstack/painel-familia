import { useState, type FormEvent } from "react"
import { supabase } from "@/lib/supabase"
import { usePessoa } from "@/contexts/PessoaContext"
import { codigoValido, normalizarCodigo } from "@/lib/validacao"

/**
 * Tela de identificação — exibida quando ninguém está "logado" ainda
 * neste navegador. Pede nome + código, confere se a combinação existe
 * no banco de dados, e identifica a pessoa no PessoaContext.
 */
export function IdentificacaoPage() {
  const { identificar } = usePessoa()

  const [nome, setNome] = useState("")
  const [codigo, setCodigo] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setErro(null)

    if (!nome.trim()) {
      setErro("Informe seu nome.")
      return
    }

    if (!codigoValido(codigo)) {
      setErro("Código inválido. Use o formato: 1 letra + 2 números (ex: G26).")
      return
    }

    setEnviando(true)

    const codigoFormatado = normalizarCodigo(codigo)

    const { data, error } = await supabase
      .from("pessoas")
      .select("*")
      .eq("codigo", codigoFormatado)
      .maybeSingle()

    setEnviando(false)

    if (error) {
      setErro("Erro ao verificar o código. Tente novamente.")
      return
    }

    if (!data) {
      setErro("Código não encontrado. Verifique com quem cadastrou os moradores.")
      return
    }

    if (data.nome.trim().toLowerCase() !== nome.trim().toLowerCase()) {
      setErro("O nome não confere com o código informado.")
      return
    }

    identificar(data)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Painel Família
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Identifique-se para continuar
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-border bg-card p-6"
        >
          <div className="mb-4">
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
              placeholder="Seu nome"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              autoComplete="off"
            />
          </div>

          <div className="mb-5">
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
              placeholder="Ex: G26"
              maxLength={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm uppercase text-foreground outline-none ring-offset-background placeholder:text-muted-foreground placeholder:normal-case focus-visible:ring-2 focus-visible:ring-ring"
              autoComplete="off"
            />
          </div>

          {erro && (
            <p className="mb-4 text-sm text-destructive">{erro}</p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {enviando ? "Verificando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Ainda não tem um código?{" "}
          <a href="/pessoas" className="font-medium text-foreground underline underline-offset-2">
            Cadastre-se aqui
          </a>
        </p>
      </div>
    </div>
  )
}
