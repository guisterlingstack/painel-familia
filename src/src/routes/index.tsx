import { createBrowserRouter } from "react-router-dom"
import { HojePage } from "@/pages/HojePage"

/**
 * Definição central de todas as rotas (telas) do sistema.
 *
 * Cada entrada aqui representa uma URL e qual componente de página
 * deve ser exibido nela. Nas próximas etapas, vamos adicionar rotas
 * para: /projetos, /agenda, /pessoas, /configuracoes, etc.
 */
export const router = createBrowserRouter([
  {
    path: "/",
    element: <HojePage />,
  },
])
