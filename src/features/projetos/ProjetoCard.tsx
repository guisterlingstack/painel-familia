import { MoreHorizontal, Archive, ArchiveRestore, Copy, Trash2, Undo2 } from "lucide-react"
import { useState } from "react"
import type { ProjetoListado, AbaProjetos } from "@/features/projetos/useProjetos"

interface ProjetoCardProps {
  projeto: ProjetoListado
  aba: AbaProjetos
  onAbrir: (id: string) => void
  onDuplicar: (id: string) => void
  onArquivar: (id: string) => void
  onDesarquivar: (id: string) => void
  onExcluir: (id: string) => void
  onRestaurar: (id: string) => void
  onExcluirDefinitivamente: (id: string) => void
}

/**
 * Card de projeto, no estilo de "cartão" inspirado no Notion:
 * faixa de cor da categoria, nome, descrição resumida, badges de
 * status/prioridade, e um menu de ações que muda conforme a aba
 * atual (Ativos / Arquivados / Excluídos).
 */
export function ProjetoCard({
  projeto,
  aba,
  onAbrir,
  onDuplicar,
  onArquivar,
  onDesarquivar,
  onExcluir,
  onRestaurar,
  onExcluirDefinitivamente,
}: ProjetoCardProps) {
  const [menuAberto, setMenuAberto] = useState(false)

  return (
    <div className="group relative rounded-lg border border-border bg-card transition-shadow hover:shadow-sm">
      <button
        onClick={() => onAbrir(projeto.id)}
        className="w-full p-4 text-left"
      >
        <div className="mb-2 flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: projeto.corCategoria ?? "#94a3b8" }}
          />
          <h3 className="truncate text-sm font-medium text-foreground">
            {projeto.nome}
          </h3>
        </div>

        {projeto.descricao && (
          <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
            {projeto.descricao}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-1.5">
          {projeto.nomeStatus && (
            <span className="rounded bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
              {projeto.nomeStatus}
            </span>
          )}
          {projeto.nomePrioridade && (
            <span className="rounded bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
              {projeto.emojiPrioridade} {projeto.nomePrioridade}
            </span>
          )}
        </div>

        {projeto.nomeCriador && (
          <p className="mt-3 text-xs text-muted-foreground">
            Criado por {projeto.nomeCriador}
          </p>
        )}
      </button>

      <div className="absolute right-2 top-2">
        <button
          onClick={(e) => {
            e.stopPropagation()
            setMenuAberto((v) => !v)
          }}
          className="rounded-md p-1.5 text-muted-foreground opacity-0 hover:bg-secondary hover:text-foreground group-hover:opacity-100"
          aria-label="Mais ações"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>

        {menuAberto && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setMenuAberto(false)}
            />
            <div className="absolute right-0 z-20 mt-1 w-44 rounded-md border border-border bg-card py-1 shadow-md">
              {aba === "ativos" && (
                <>
                  <ItemMenu
                    icone={<Copy className="h-3.5 w-3.5" />}
                    texto="Duplicar"
                    onClick={() => {
                      onDuplicar(projeto.id)
                      setMenuAberto(false)
                    }}
                  />
                  <ItemMenu
                    icone={<Archive className="h-3.5 w-3.5" />}
                    texto="Arquivar"
                    onClick={() => {
                      onArquivar(projeto.id)
                      setMenuAberto(false)
                    }}
                  />
                  <ItemMenu
                    icone={<Trash2 className="h-3.5 w-3.5" />}
                    texto="Excluir"
                    destrutivo
                    onClick={() => {
                      onExcluir(projeto.id)
                      setMenuAberto(false)
                    }}
                  />
                </>
              )}

              {aba === "arquivados" && (
                <>
                  <ItemMenu
                    icone={<ArchiveRestore className="h-3.5 w-3.5" />}
                    texto="Desarquivar"
                    onClick={() => {
                      onDesarquivar(projeto.id)
                      setMenuAberto(false)
                    }}
                  />
                  <ItemMenu
                    icone={<Trash2 className="h-3.5 w-3.5" />}
                    texto="Excluir"
                    destrutivo
                    onClick={() => {
                      onExcluir(projeto.id)
                      setMenuAberto(false)
                    }}
                  />
                </>
              )}

              {aba === "excluidos" && (
                <>
                  <ItemMenu
                    icone={<Undo2 className="h-3.5 w-3.5" />}
                    texto="Restaurar"
                    onClick={() => {
                      onRestaurar(projeto.id)
                      setMenuAberto(false)
                    }}
                  />
                  <ItemMenu
                    icone={<Trash2 className="h-3.5 w-3.5" />}
                    texto="Excluir definitivamente"
                    destrutivo
                    onClick={() => {
                      onExcluirDefinitivamente(projeto.id)
                      setMenuAberto(false)
                    }}
                  />
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function ItemMenu({
  icone,
  texto,
  onClick,
  destrutivo,
}: {
  icone: React.ReactNode
  texto: string
  onClick: () => void
  destrutivo?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs hover:bg-secondary ${
        destrutivo ? "text-destructive" : "text-foreground"
      }`}
    >
      {icone}
      {texto}
    </button>
  )
}
