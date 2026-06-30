import { createBrowserRouter } from "react-router-dom"
import { HojePage } from "@/pages/HojePage"
import { PessoasPage } from "@/pages/PessoasPage"
import { ProjetosPage } from "@/pages/ProjetosPage"
import { ProjetoDetalhePage } from "@/pages/ProjetoDetalhePage"
import { AgendaPage } from "@/pages/AgendaPage"
import { ConfiguracoesPage } from "@/pages/ConfiguracoesPage"

/**
 * Definição central de todas as rotas (telas) do sistema.
 */
export const router = createBrowserRouter([
  {
    path: "/",
    element: <HojePage />,
  },
  {
    path: "/pessoas",
    element: <PessoasPage />,
  },
  {
    path: "/projetos",
    element: <ProjetosPage />,
  },
  {
    path: "/projetos/:id",
    element: <ProjetoDetalhePage />,
  },
  {
    path: "/agenda",
    element: <AgendaPage />,
  },
  {
    path: "/configuracoes",
    element: <ConfiguracoesPage />,
  },
])
