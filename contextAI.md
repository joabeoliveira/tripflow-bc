# Contexto e Especificação Completa (contextAI.md) - TripFlow BC

## 1. Visão Geral do Projeto
O **TripFlow BC** é uma aplicação web Full-Stack e Mobile-First criada para gerenciar e consultar o roteiro da viagem em família para Balneário Camboriú (de 26/11/2026 a 01/12/2026). 
O sistema deve permitir consulta rápida pelo celular durante os passeios, oferecer **CRUD completo** em todos os eventos e notas/checklists, exibir notificações na tela em tempo real e rodar em um único container Docker gerenciado pelo **Easypanel** em uma VPS própria.

## 2. Stack Tecnológica
- **Framework Full-Stack:** Next.js 14+ (App Router) com TypeScript.
- **Estilização:** Tailwind CSS (Abordagem estritamente Mobile-First).
- **Ícones:** `lucide-react` (ícones temáticos de viagem: avião, praia, parque, pizza, calendário, mapa, check).
- **Notificações na Tela:** `sonner` (Toasts no topo da tela para feedback de todas as ações CRUD e alertas).
- **Banco de Dados & ORM:** Prisma ORM com **SQLite** (`DATABASE_URL="file:./data/tripflow.db"`).
- **Back-end:** Next.js Route Handlers (`/api/events` e `/api/notes`).

## 3. Identidade Visual & UI/UX
- **Tema Padrão:** Dark Mode elegante com estética profissional de aplicativo de viagem.
- **Paleta de Cores:**
  - Background Principal: `#121212`
  - Background de Cards/Modais/Containers: `#1e1e1e`
  - Bordas Sutis: `#2e2e2e`
  - Acentos Primários (Teal / Azul Petróleo): `#008B8B`, `#0B8494` e `#208494`
  - Texto Principal: `#F3F4F6` | Texto Secundário: `#9CA3AF`
- **Mobile-First:** Botões com área de toque mínima de `44px`, barra de navegação inferior fixa (*Bottom Navigation*) ou abas superiores fáceis de acionar no celular, e cards com badges de categoria e status.

## 4. Modelagem de Dados (`prisma/schema.prisma`)

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model TripEvent {
  id          Int      @id @default(autoincrement())
  date        String   // Formato: "YYYY-MM-DD" (ex: "2026-11-26") para ordenação e filtro
  displayDate String   // Formato: "DD/MM/YYYY" (ex: "26/11/2026")
  weekday     String   // Ex: "Quinta-feira"
  period      String   // Ex: "Manhã", "Tarde", "Noite", "Madrugada", "Dia Todo"
  time        String?  // Horário específico (ex: "16:40", "18:30", "03:15")
  title       String
  location    String?
  details     String
  category    String   // "Transporte" | "Passeio" | "Praia" | "Comemoração" | "Lazer" | "Hospedagem"
  completed   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model TripNote {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  category  String   // "Checklist" | "Dica" | "Transfer/Uber"
  done      Boolean  @default(false)
  createdAt DateTime @default(now())
}

```

## 5. Funcionalidades e Regras de Negócio

1. **Aba 1 - "Eventos do Dia":**
* Seletor horizontal de dias (`26/11` a `01/12`). Seleciona o dia atual (se estiver no período) ou `2026-11-26` por padrão.
* Timeline vertical com cards detalhados, botão rápido de concluir (check) e botões de Editar/Excluir.


2. **Aba 2 - "Toda a Viagem":**
* Visão completa agrupada por dia, barra de progresso dos passeios concluídos e filtro rápido por categoria.


3. **Aba 3 - "Notas & Checklist" (CRUD Extra):**
* CRUD completo de notas rápidas, checklist de bagagem e contatos de motoristas de Transfer/Uber.


4. **CRUD Completo de Eventos:**
* Modal responsivo para Criar e Editar eventos (todos os campos editáveis), confirmação de exclusão e toggle de concluído.


5. **Notificações na Tela:**
* Disparar `toast.success()` ou `toast.error()` via `sonner` em todas as operações de CRUD.
* Exibir um Banner de Destaque no topo indicando o próximo evento importante (com destaque especial para o aniversário da Bruna em 29/11 e o transfer da madrugada em 01/12).



## 6. Auto-Seed Obrigatório do Roteiro

Na rota `GET /api/events`, se `prisma.tripEvent.count()` for `0`, inserir automaticamente os seguintes registros antes de retornar a lista:

1. `2026-11-26` | `26/11/2026` | `Quinta-feira` | `Tarde / Noite` | `16:40 - 18:30` | **Voo Rio (GIG) ➔ Navegantes (NVT) & Transfer** | Local: `Aeroporto Galeão / Navegantes` | Categoria: `Transporte` | Detalhes: `Saída do Galeão às 16:40 e chegada prevista às 18:30. Transfer contratado até Balneário Camboriú.`
2. `2026-11-26` | `26/11/2026` | `Quinta-feira` | `Noite` | `19:30` | **Check-in na Casa & Caminhada na Orla** | Local: `Rua Euclides Rosa, 52 - Barra` | Categoria: `Hospedagem` | Detalhes: `Acomodação na casa alugada no bairro da Barra e caminhada leve pela Av. Atlântica.`
3. `2026-11-27` | `27/11/2026` | `Sexta-feira` | `Dia Todo` | `08:30 - 19:00` | **Beto Carrero World** | Local: `Penha - SC` | Categoria: `Passeio` | Detalhes: `Dia inteiro no parque. Ida e volta de transfer/Uber. Noite livre para descanso na casa.`
4. `2026-11-28` | `28/11/2026` | `Sábado` | `Manhã / Tarde` | `09:30` | **Parque Unipraias & Praia de Laranjeiras** | Local: `Barra Sul / Laranjeiras` | Categoria: `Passeio` | Detalhes: `Bondinho aéreo saindo da Barra Sul (próximo à casa), mirantes e tarde na Praia de Laranjeiras.`
5. `2026-11-28` | `28/11/2026` | `Sábado` | `Fim de Tarde` | `17:30` | **Pôr do Sol no Molhe da Barra Sul** | Local: `Molhe da Barra Sul` | Categoria: `Praia` | Detalhes: `Passeio gratuito caminhando pelo molhe com vista panorâmica da orla.`
6. `2026-11-29` | `29/11/2026` | `Domingo` | `Manhã` | `10:00` | **Oceanic Aquarium** | Local: `Barra Sul - Balneário Camboriú` | Categoria: `Passeio` | Detalhes: `Visita ao aquário moderno. Fácil acesso de Uber.`
7. `2026-11-29` | `29/11/2026` | `Domingo` | `Tarde` | `14:30` | **Praia de Taquaras** | Local: `Rota Interpraias` | Categoria: `Praia` | Detalhes: `Passeio gratuito para curtir a natureza e o mar em família.`
8. `2026-11-29` | `29/11/2026` | `Domingo` | `Noite` | `20:00` | **🎉 Aniversário da Bruna na Heróis da Pizza!** | Local: `3ª Avenida - Balneário Camboriú` | Categoria: `Comemoração` | Detalhes: `Comemoração especial do aniversário da sobrinha Bruna no rodízio temático de super-heróis.`
9. `2026-11-30` | `30/11/2026` | `Segunda-feira` | `Manhã` | `09:30` | **Passarela da Barra & Bairro Histórico** | Local: `Bairro da Barra (próximo à Rua Euclides Rosa)` | Categoria: `Lazer` | Detalhes: `Passeio gratuito a poucos passos da casa, atravessando o Rio Camboriú.`
10. `2026-11-30` | `30/11/2026` | `Segunda-feira` | `Tarde / Noite` | `14:00` | **Praia Central, Compras e Despedida** | Local: `Av. Atlântica / Centro` | Categoria: `Lazer` | Detalhes: `Tarde livre para curtir a praia, compras e jantar de despedida.`
11. `2026-12-01` | `01/12/2026` | `Terça-feira` | `Madrugada` | `03:15 - 05:30` | **Transfer e Voo de Retorno (NVT ➔ GIG)** | Local: `Rua Euclides Rosa, 52 ➔ Aeroporto de Navegantes` | Categoria: `Transporte` | Detalhes: `Transfer busca na casa às 03:15 da manhã para o voo das 05:30.`

## 7. Configuração de Deploy para o Easypanel (Docker)

* O agente DEVE criar um `Dockerfile` na raiz do projeto preparado para o Easypanel, configurando o `DATABASE_URL="file:/app/prisma/data/tripflow.db"`, gerando o Prisma Client (`npx prisma generate`), compilando o Next.js e executando `npx prisma db push && npm start` no comando final (`CMD`) na porta `3000`.
* Garantir que a pasta `prisma/data` exista para mapeamento de volume no Easypanel.

## 8. Plano de Execução Autônoma para o Agente (Antigravity)

Quando solicitado a construir o projeto, execute esta sequência sem deixar código incompleto ou placeholders (`// TODO`):

1. Inicializar a estrutura Next.js + TypeScript + Tailwind + Prisma + `lucide-react` + `sonner`.
2. Criar o `prisma/schema.prisma` e o cliente Prisma singleton (`src/lib/prisma.ts`).
3. Criar as rotas de API (`/api/events` com auto-seed, `/api/events/[id]`, `/api/notes` e `/api/notes/[id]`).
4. Construir a interface completa em `src/app/page.tsx` (e componentes auxiliares) com o tema Dark/Teal (`#121212`, `#1e1e1e`, `#008B8B`), modais de CRUD e notificações `sonner`.
5. Criar o `Dockerfile` e `.dockerignore` prontos para o Easypanel.
