import { NavegacaoPrincipal } from "@/components/NavegacaoPrincipal"
import { GerenciadorStatus } from "@/features/configuracoes/GerenciadorStatus"
import { GerenciadorPrioridades } from "@/features/configuracoes/GerenciadorPrioridades"
import { GerenciadorCategorias } from "@/features/configuracoes/GerenciadorCategorias"

/**
 * Tela de Configurações: permite editar, criar e excluir os status,
 * prioridades e categorias disponíveis no sistema. A exclusão é
 * bloqueada quando o item está em uso por algum projeto, para evitar
 * dados inconsistentes.
 */
export function ConfiguracoesPage() {
  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <NavegacaoPrincipal />

        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Configurações
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie os status, prioridades e categorias do sistema.
          </p>
        </header>

        <div className="space-y-5">
          <GerenciadorStatus />
          <GerenciadorPrioridades />
          <GerenciadorCategorias />
        </div>
      </div>
    </div>
  )
}
