# Painel Família

Sistema web privado de organização pessoal e familiar — uso interno, não comercial.

## O que é este sistema

Um painel compartilhado para os moradores da casa organizarem projetos, acompanharem uma agenda semanal e colaborarem com identificação de quem criou ou alterou cada item.

## Tecnologias

- **Frontend:** React + Vite + TypeScript + Tailwind CSS + React Router
- **Backend:** Supabase (PostgreSQL)
- **Hospedagem:** Cloudflare Pages
- **Tipo de aplicação:** PWA (Progressive Web App), instalável e responsivo para desktop e celular

## Estrutura de pastas

```
src/
  components/   → Componentes reutilizáveis de interface (navegação, porteiro de login)
  pages/        → Telas completas do sistema (Hoje, Projetos, Agenda, etc.)
  features/     → Lógica e componentes específicos de cada funcionalidade
    dashboard/      → Hooks e componentes da tela Hoje
    projetos/        → Hooks, ações e componentes da tela Projetos e seu detalhe
    agenda/          → Hooks e componentes da tela Agenda
    configuracoes/   → Ações dos gerenciadores de status/prioridades/categorias
  lib/          → Utilitários e configuração de bibliotecas externas (Supabase, calendário)
  types/        → Definições de tipos do TypeScript usadas em todo o projeto
  contexts/     → Contextos do React (pessoa identificada atualmente)
  routes/       → Definição central das rotas (URLs) do sistema, com lazy loading
```

## Status do desenvolvimento

- [x] Etapa 1 — Estrutura base do projeto
- [x] Etapa 2 — Configuração do Supabase
- [x] Etapa 3 — Cadastro e identificação de pessoas
- [x] Etapa 4 — Tela "Hoje" completa
- [x] Etapa 5 — Tela de Projetos
- [x] Etapa 6 — Detalhe do Projeto
- [x] Etapa 7 — Tela de Agenda
- [x] Etapa 8 — Configurações (status, prioridades, categorias)
- [x] Etapa 9 — Deploy no Cloudflare Pages
- [x] Etapa 10 — PWA e revisão final

## Como rodar localmente (opcional)

Este projeto foi desenvolvido inteiramente via upload manual para o GitHub, sem
necessidade de rodar nada localmente. Caso queira rodar no seu próprio
computador no futuro:

```bash
npm install
cp .env.example .env   # preencha com suas chaves do Supabase
npm run dev
```

## Banco de dados

8 tabelas no Supabase: `pessoas`, `status`, `prioridades`, `categorias`,
`projetos`, `checklist_items`, `projeto_horarios`, `log_alteracoes`.
Segurança via Row Level Security (RLS), com política de acesso total
para a chave pública (`anon`/`publishable`), adequada para este uso
doméstico privado.
