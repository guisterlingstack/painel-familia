import { lazy, Suspense } from "react"
import { createBrowserRouter } from "react-router-dom"

/**
 * Definição central de todas as rotas (telas) do sistema.
 *
 * Cada página é carregada sob demanda (lazy loading): o navegador só
 * baixa o código de uma tela quando a pessoa realmente navega até
 * ela, em vez de baixar o sistema inteiro de uma vez. Isso deixa o
 * primeiro carregamento do app mais rápido, especialmente em
 * conexões de celular.
 */
const HojePage = lazy(() =>
  import("@/pages/HojePage").then((m) => ({ default: m.HojePage }))
)
const PessoasPage = lazy(() =>
  import("@/pages/PessoasPage").then((m) => ({ default: m.PessoasPage }))
)
const ProjetosPage = lazy(() =>
  import("@/pages/ProjetosPage").then((m) => ({ default: m.ProjetosPage }))
)
const ProjetoDetalhePage = lazy(() =>
  import("@/pages/ProjetoDetalhePage").then((m) => ({
    default: m.ProjetoDetalhePage,
  }))
)
const AgendaPage = lazy(() =>
  import("@/pages/AgendaPage").then((m) => ({ default: m.AgendaPage }))
)
const ConfiguracoesPage = lazy(() =>
  import("@/pages/ConfiguracoesPage").then((m) => ({
    default: m.ConfiguracoesPage,
  }))
)

function ComSuspense({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ComSuspense>
        <HojePage />
      </ComSuspense>
    ),
  },
  {
    path: "/pessoas",
    element: (
      <ComSuspense>
        <PessoasPage />
      </ComSuspense>
    ),
  },
  {
    path: "/projetos",
    element: (
      <ComSuspense>
        <ProjetosPage />
      </ComSuspense>
    ),
  },
  {
    path: "/projetos/:id",
    element: (
      <ComSuspense>
        <ProjetoDetalhePage />
      </ComSuspense>
    ),
  },
  {
    path: "/agenda",
    element: (
      <ComSuspense>
        <AgendaPage />
      </ComSuspense>
    ),
  },
  {
    path: "/configuracoes",
    element: (
      <ComSuspense>
        <ConfiguracoesPage />
      </ComSuspense>
    ),
  },
])
