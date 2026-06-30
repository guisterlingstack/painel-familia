# Painel Família

Sistema web privado de organização pessoal e familiar — uso interno, não comercial.

## O que é este sistema

Um painel compartilhado para os moradores da casa organizarem projetos, acompanharem uma agenda semanal e colaborarem com identificação de quem criou ou alterou cada item.

## Tecnologias

- **Frontend:** React + Vite + TypeScript + Tailwind CSS + shadcn/ui + React Router
- **Backend:** Supabase (PostgreSQL)
- **Hospedagem:** Cloudflare Pages
- **Tipo de aplicação:** PWA (Progressive Web App), responsivo para desktop e celular

## Estrutura de pastas

```
src/
  components/   → Componentes reutilizáveis de interface (botões, cards, etc.)
    ui/         → Componentes de base do shadcn/ui
  pages/        → Telas completas do sistema (Hoje, Projetos, Agenda, etc.)
  features/     → Lógica e componentes específicos de cada funcionalidade
  hooks/        → Funções React reutilizáveis (ex: lógica de dados compartilhada)
  lib/          → Utilitários e configuração de bibliotecas externas (ex: Supabase)
  types/        → Definições de tipos do TypeScript usadas em todo o projeto
  contexts/     → Contextos do React (ex: usuário identificado atualmente)
  routes/       → Definição central das rotas (URLs) do sistema
```

## Status do desenvolvimento

Este projeto está sendo desenvolvido em etapas, com acompanhamento passo a passo.

- [x] Etapa 1 — Estrutura base do projeto (React + Vite + TypeScript + Tailwind)
- [ ] Etapa 2 — Configuração do Supabase (banco de dados)
- [ ] Etapa 3 — Cadastro e identificação de pessoas
- [ ] Etapa 4 — Tela "Hoje" completa
- [ ] Etapa 5 — Tela de Projetos
- [ ] Etapa 6 — Detalhe do Projeto
- [ ] Etapa 7 — Tela de Agenda
- [ ] Etapa 8 — Configurações (status, prioridades, categorias)
- [ ] Etapa 9 — Deploy no Cloudflare Pages
- [ ] Etapa 10 — PWA e revisão final
