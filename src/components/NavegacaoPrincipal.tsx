import { Link, useLocation } from "react-router-dom"

const ITENS = [
  { caminho: "/", rotulo: "Hoje" },
  { caminho: "/projetos", rotulo: "Projetos" },
  { caminho: "/agenda", rotulo: "Agenda" },
  { caminho: "/pessoas", rotulo: "Pessoas" },
  { caminho: "/configuracoes", rotulo: "Configurações" },
]

/**
 * Barra de navegação simples entre as telas principais do sistema.
 * Reutilizada em todas as páginas principais (Hoje, Projetos, Agenda,
 * Pessoas, Configurações).
 */
export function NavegacaoPrincipal() {
  const location = useLocation()

  return (
    <nav className="mb-8 flex gap-4 border-b border-border pb-3">
      {ITENS.map((item) => {
        const ativo = location.pathname === item.caminho
        return (
          <Link
            key={item.caminho}
            to={item.caminho}
            className={`text-sm font-medium ${
              ativo
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.rotulo}
          </Link>
        )
      })}
    </nav>
  )
}
