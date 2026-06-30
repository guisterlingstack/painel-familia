import { RouterProvider } from "react-router-dom"
import { router } from "@/routes"
import { PessoaProvider } from "@/contexts/PessoaContext"
import { ExigeIdentificacao } from "@/components/ExigeIdentificacao"

function App() {
  return (
    <PessoaProvider>
      <ExigeIdentificacao>
        <RouterProvider router={router} />
      </ExigeIdentificacao>
    </PessoaProvider>
  )
}

export default App
