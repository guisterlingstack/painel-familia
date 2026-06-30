import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"
import type { Pessoa } from "@/types/database"

const CHAVE_STORAGE = "painel-familia:pessoa-atual"

interface PessoaContextValue {
  pessoa: Pessoa | null
  identificar: (pessoa: Pessoa) => void
  sair: () => void
}

const PessoaContext = createContext<PessoaContextValue | undefined>(
  undefined
)

/**
 * Provedor de identificação do usuário.
 *
 * Guarda a pessoa identificada atualmente em duas camadas:
 * 1. Em memória (useState), para o React reagir a mudanças
 * 2. No localStorage do navegador, para a identificação persistir
 *    mesmo se a pessoa fechar e reabrir o navegador
 *
 * Qualquer componente do sistema pode perguntar "quem é a pessoa
 * atual?" usando o hook usePessoa() definido abaixo.
 */
export function PessoaProvider({ children }: { children: ReactNode }) {
  const [pessoa, setPessoa] = useState<Pessoa | null>(null)
  const [carregado, setCarregado] = useState(false)

  useEffect(() => {
    const salva = localStorage.getItem(CHAVE_STORAGE)
    if (salva) {
      try {
        setPessoa(JSON.parse(salva))
      } catch {
        localStorage.removeItem(CHAVE_STORAGE)
      }
    }
    setCarregado(true)
  }, [])

  function identificar(pessoaIdentificada: Pessoa) {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(pessoaIdentificada))
    setPessoa(pessoaIdentificada)
  }

  function sair() {
    localStorage.removeItem(CHAVE_STORAGE)
    setPessoa(null)
  }

  // Evita "piscar" a tela de identificação antes de checar o localStorage
  if (!carregado) {
    return null
  }

  return (
    <PessoaContext.Provider value={{ pessoa, identificar, sair }}>
      {children}
    </PessoaContext.Provider>
  )
}

export function usePessoa() {
  const contexto = useContext(PessoaContext)
  if (!contexto) {
    throw new Error("usePessoa precisa ser usado dentro de um PessoaProvider")
  }
  return contexto
}
