import { createBrowserRouter } from "react-router-dom"
import { HojePage } from "@/pages/HojePage"
import { PessoasPage } from "@/pages/PessoasPage"
import { ProjetosPage } from "@/pages/ProjetosPage"
import { ProjetoDetalhePage } from "@/pages/ProjetoDetalhePage"
import { AgendaPage } from "@/pages/AgendaPage"

/**
 * Definição central de todas as rotas (telas) do sistema.
 *
 * Cada entrada aqui representa uma URL e qual componente de página
 * deve ser exibido nela. Nas próximas etapas, vamos adicionar rotas
 * para: /configuracoes, etc.
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
])
