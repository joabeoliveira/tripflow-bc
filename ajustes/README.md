# Ajustes e Melhorias

Pasta destinada exclusivamente a **tasks de ajustes e melhorias** do TripFlow BC.
Nada daqui é executado pela aplicação — é área de trabalho/documentação de mudanças.

## Como usar

1. Crie um arquivo por task, com nome curto e descritivo em kebab-case:
   `001-filtro-por-categoria.md`, `002-toast-ao-concluir-evento.md`, ...
2. Use o template `_template.md` como base (copie e renomeie).
3. Marque o status no topo (`pendente` | `em andamento` | `feito`).

## Template mínimo

```md
# <título da melhoria>

- **Status:** pendente
- **Prioridade:** alta | média | baixa
- **Área:** UI | API | Banco | Deploy | Outro

## Objetivo
O que deve mudar e por quê.

## Comportamento esperado
Critérios de aceite verificáveis no ambiente de produção.

## Observações
Restrições, dependências e riscos (ex.: mudança de schema Prisma / SQLite).
```

## Restrições do ambiente

- Sem execução local: build, testes e validação acontecem no deploy do Easypanel (push na `main`).
- Banco em produção é SQLite (`file:/app/prisma/data/tripflow.db`) com `prisma db push` no start:
  mudanças de schema devem ser **aditivas** para não perder dados.
