import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Archive, ArchiveRestore, Trash2 } from "lucide-react"
import { usePessoa } from "@/contexts/PessoaContext"
import { useProjeto } from "@/features/projetos/useProjeto"
import { useOpcoesProjeto } from "@/features/projetos/useOpcoesProjeto"
import {
  atualizarProjeto,
  arquivarProjeto,
  desarquivarProjeto,
  excluirProjeto,
} from "@/features/projetos/acoesProjeto"
import { salvarHorariosProjeto, type HorarioSelecionado } from "@/features/projetos/acoesHorarios"
import { ChecklistProjeto } from "@/features/projetos/ChecklistProjeto"
import { SeletorHorarios } from "@/features/projetos/SeletorHorarios"

/**
 * Tela de Detalhe do Projeto.
 *
 * Reúne: nome, descrição, checklist, prioridade, categoria, status,
 * dias da semana + horários, quem criou, e os botões de Arquivar e
 * Excluir — exatamente como especificado.
 *
 * Edição: os campos de texto salvam ao perder o foco (onBlur) e os
 * seletores (status/prioridade/categoria) salvam ao serem alterados,
 * sem precisar de um botão "Salvar" separado.
 */
export function ProjetoDetalhePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { pessoa } = usePessoa()

  const { projeto, checklist, horarios, carregando, naoEncontrado, recarregar } =
    useProjeto(id)
  const { statusList, prioridadesList, categoriasList } = useOpcoesProjeto()

  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [horariosSelecionados, setHorariosSelecionados] = useState<
    HorarioSelecionado[]
  >([])
  const [salvandoHorarios, setSalvandoHorarios] = useState(false)

  useEffect(() => {
    if (projeto) {
      setNome(projeto.nome)
      setDescricao(projeto.descricao ?? "")
    }
  }, [projeto])

  useEffect(() => {
    setHorariosSelecionados(
      horarios.map((h) => ({ data: h.data, horario: h.horario }))
    )
  }, [horarios])

  if (carregando) {
    return (
      <div className="min-h-screen bg-background px-6 py-10">
        <div className="mx-auto max-w-2xl">
          <div className="h-64 animate-pulse rounded-lg border border-border bg-muted" />
        </div>
      </div>
    )
  }

  if (naoEncontrado || !projeto) {
    return (
      <div className="min-h-screen bg-background px-6 py-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm text-muted-foreground">
            Projeto não encontrado.
          </p>
          <button
            onClick={() => navigate("/projetos")}
            className="mt-4 text-sm text-foreground underline underline-offset-2"
          >
            Voltar para Projetos
          </button>
        </div>
      </div>
    )
  }

  async function salvarCampo(campos: Parameters<typeof atualizarProjeto>[2]) {
    if (!pessoa || !projeto) return
    await atualizarProjeto(projeto.id, pessoa.id, campos)
    recarregar()
  }

  async function handleSalvarHorarios() {
    if (!projeto) return
    setSalvandoHorarios(true)
    try {
      await salvarHorariosProjeto(projeto.id, horariosSelecionados)
      recarregar()
    } finally {
      setSalvandoHorarios(false)
    }
  }

  async function handleArquivar() {
    if (!pessoa || !projeto) return
    await arquivarProjeto(projeto.id, pessoa.id)
    navigate("/projetos")
  }

  async function handleDesarquivar() {
    if (!pessoa || !projeto) return
    await desarquivarProjeto(projeto.id, pessoa.id)
    recarregar()
  }

  async function handleExcluir() {
    if (!pessoa || !projeto) return
    const confirmado = window.confirm(
      `Excluir o projeto "${projeto.nome}"? Ele poderá ser restaurado na aba Projetos Excluídos.`
    )
    if (!confirmado) return
    await excluirProjeto(projeto.id, pessoa.id)
    navigate("/projetos")
  }

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <button
          onClick={() => navigate("/projetos")}
          className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Projetos
        </button>

        {projeto.arquivado && (
          <div className="mb-4 rounded-md bg-secondary px-3 py-2 text-xs font-medium text-secondary-foreground">
            Este projeto está arquivado.
          </div>
        )}

        {/* Nome */}
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          onBlur={() => {
            if (nome.trim() && nome !== projeto.nome) {
              salvarCampo({ nome: nome.trim() })
            }
          }}
          className="mb-1 w-full border-none bg-transparent text-2xl font-semibold tracking-tight text-foreground outline-none"
        />

        <p className="mb-6 text-xs text-muted-foreground">
          Criado por {projeto.nomeCriador ?? "desconhecido"} em{" "}
          {new Date(projeto.criadoEm).toLocaleDateString("pt-BR")}
        </p>

        {/* Status, Prioridade, Categoria */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Status
            </label>
            <select
              value={projeto.statusId ?? ""}
              onChange={(e) =>
                salvarCampo({ statusId: e.target.value || null })
              }
              className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">—</option>
              {statusList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Prioridade
            </label>
            <select
              value={projeto.prioridadeId ?? ""}
              onChange={(e) =>
                salvarCampo({ prioridadeId: e.target.value || null })
              }
              className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">—</option>
              {prioridadesList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.emoji} {p.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Categoria
            </label>
            <select
              value={projeto.categoriaId ?? ""}
              onChange={(e) =>
                salvarCampo({ categoriaId: e.target.value || null })
              }
              className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">—</option>
              {categoriasList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Descrição */}
        <div className="mb-6">
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Descrição
          </label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            onBlur={() => {
              if (descricao !== (projeto.descricao ?? "")) {
                salvarCampo({ descricao: descricao.trim() || null })
              }
            }}
            rows={4}
            placeholder="Sem descrição (opcional)"
            className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        {/* Checklist */}
        <div className="mb-6">
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Checklist
          </label>
          {pessoa && (
            <ChecklistProjeto
              projetoId={projeto.id}
              itens={checklist}
              pessoaId={pessoa.id}
              onAlterado={recarregar}
            />
          )}
        </div>

        {/* Dias da semana + horários */}
        <div className="mb-6">
          <div className="mb-1.5 flex items-center justify-between">
            <label className="block text-xs font-medium text-muted-foreground">
              Dias da semana e horários
            </label>
            <button
              onClick={handleSalvarHorarios}
              disabled={salvandoHorarios}
              className="text-xs font-medium text-primary hover:underline disabled:opacity-60"
            >
              {salvandoHorarios ? "Salvando..." : "Salvar programação"}
            </button>
          </div>
          <SeletorHorarios
            selecionados={horariosSelecionados}
            onAlterar={setHorariosSelecionados}
          />
        </div>

        {/* Ações */}
        <div className="flex gap-2 border-t border-border pt-6">
          {projeto.arquivado ? (
            <button
              onClick={handleDesarquivar}
              className="flex items-center gap-1.5 rounded-md border border-input px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
            >
              <ArchiveRestore className="h-4 w-4" />
              Desarquivar
            </button>
          ) : (
            <button
              onClick={handleArquivar}
              className="flex items-center gap-1.5 rounded-md border border-input px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
            >
              <Archive className="h-4 w-4" />
              Arquivar
            </button>
          )}

          <button
            onClick={handleExcluir}
            className="flex items-center gap-1.5 rounded-md border border-input px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
            Excluir
          </button>
        </div>
      </div>
    </div>
  )
}
