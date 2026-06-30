import type { ReactNode } from "react"
import { usePessoa } from "@/contexts/PessoaContext"
import { IdentificacaoPage } from "@/pages/IdentificacaoPage"

/**
 * Componente "porteiro" do sistema.
 *
 * Se ninguém estiver identificado neste navegador, mostra a tela de
 * identificação e bloqueia o acesso ao resto do app. Se já houver uma
 * pessoa identificada (guardada no localStorage), libera o conteúdo
 * normalmente.
 *
 * Exceção: a tela de Cadastro de Pessoas (/pessoas) fica sempre
 * acessível, mesmo sem identificação — é necessário poder cadastrar
 * a primeira pessoa da casa antes de existir alguém para "entrar".
 */
export function ExigeIdentificacao({ children }: { children: ReactNode }) {
  const { pessoa } = usePessoa()

  const rotaLiberada = window.location.pathname === "/pessoas"

  if (!pessoa && !rotaLiberada) {
    return <IdentificacaoPage />
  }

  return <>{children}</>
}
