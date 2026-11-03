```markdown
# TripFlow BC - Especificação Técnica de Novas Funcionalidades e Melhorias

Este documento orienta a implementação de novas features e refatorações no app **TripFlow BC** (roteiro familiar em Balneário Camboriú). Siga o padrão de UI em Dark Mode com detalhes em azul petróleo/ciano (`#0B8494`, `#00fdfb`) já existente.

---

## 1. Botão Universal para Chamar Uber (Deep Link)

### Objetivo
Permitir que os cards de eventos e itens de transfer contenham um botão direto para solicitar corrida no app da Uber com ponto de partida na localização atual e destino pré-definido.

### Implementação da URL
Utilizar o formato Universal Link oficial:
```text
[https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff](https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff)[formatted_address]=<ENDERECO_CODIFICADO>&dropoff[nickname]=<NOME_LOCAL>

```

### Componente / Helper (`utils/uber.js` ou inline)

```javascript
export const getUberDeepLink = (address, nickname = '') => {
  const params = new URLSearchParams({
    action: 'setPickup',
    pickup: 'my_location',
    'dropoff[formatted_address]': address,
  });
  if (nickname) {
    params.set('dropoff[nickname]', nickname);
  }
  return `[https://m.uber.com/ul/?$](https://m.uber.com/ul/?$){params.toString()}`;
};

```

### Exemplos de Mapeamento para os Cards

* **Transfer Aeroporto NVT ➔ Casa na Barra:**
* `address`: `"Rua Euclides Rosa, 52 - Barra, Balneário Camboriú - SC"`
* `nickname`: `"Casa na Barra"`


* **Aniversário da Bruna:**
* `address`: `"Heróis da Pizza, Balneário Camboriú - SC"`
* `nickname`: `"Heróis da Pizza"`


* **Passeio Beto Carrero:**
* `address`: `"Beto Carrero World, Penha - SC"`
* `nickname`: `"Beto Carrero"`



### UI do Botão

* Renderizar em cards que possuam endereço válido ou categoria `Transfer/Uber`.
* Tag: `<a href={url} target="_blank" rel="noopener noreferrer" className="uber-action-btn">🚗 Pedir Uber</a>`.
* Estilo: Botão secundário ou discreto no footer do card, alinhado ao lado de `Editar` e `Excluir`.

---

## 2. Previsão do Tempo na Aba "Eventos do Dia"

### Objetivo

Exibir um indicador de clima (temperatura máxima/mínima e condição) no cabeçalho de cada dia de viagem.

### Requisitos Técnicos

1. Utilizar a API gratuita **Open-Meteo** (sem necessidade de API key).
2. Coordenadas base:
* **Balneário Camboriú:** Lat `-26.9930`, Lon `-48.6343`
* **Penha (Beto Carrero):** Lat `-26.7712`, Lon `-48.6475`


3. Endpoint de exemplo:
```text
[https://api.open-meteo.com/v1/forecast?latitude=-26.99&longitude=-48.63&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=America%2FSao_Paulo](https://api.open-meteo.com/v1/forecast?latitude=-26.99&longitude=-48.63&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=America%2FSao_Paulo)

```


4. Criar um pequeno badge no topo do dia: `☀️ 27°C / 20°C - Ensolarado`.

---

## 3. Gestão e Anexo de Documentos/Vouchers

### Objetivo

Permitir upload ou inserção de links diretos para PDFs e comprovantes (passagens aéreas, ingressos Beto Carrero, comprovante de hospedagem).

### Mudanças no Modelo de Dados (`Note` / `Event`)

```typescript
interface Attachment {
  name: string;
  url: string; // URL pública ou Base64 para visualização
  type: 'pdf' | 'image' | 'link';
}

// Estender a interface do Item/Nota
interface TripItem {
  id: string;
  title: string;
  description: string;
  category: 'Checklist' | 'Dica' | 'Transfer/Uber';
  isCompleted: boolean;
  address?: string;
  attachments?: Attachment[];
}

```

### UI

* Exibir badge ou ícone de clipe `📎 Ver Documento` nos cards que possuírem comprovantes anexados.
* Modal de visualização rápida ou abertura em nova aba com `window.open()`.

---

## 4. Visualização Geográfica dos Eventos ("Ver no Mapa")

### Objetivo

Facilitar a visualização espacial dos compromissos e restaurantes do dia.

### Implementação

* Adicionar no header do dia um botão: `📍 Ver Roteiro no Google Maps`.
* Gerar link de rota do Google Maps conectando os pontos:
```text
[https://www.google.com/maps/dir/?api=1&origin=Rua+Euclides+Rosa+52+Balneario+Camboriu&destination=Herois+da+Pizza+Balneario+Camboriu](https://www.google.com/maps/dir/?api=1&origin=Rua+Euclides+Rosa+52+Balneario+Camboriu&destination=Herois+da+Pizza+Balneario+Camboriu)

```



---

## 5. Módulo de Orçamento e Controle de Gastos

### Objetivo

Acompanhar despesas estimadas e realizadas da viagem por categoria (Alimentação, Transporte, Lazer).

### Mudanças no Modelo de Dados

* Campos opcionais por card:
* `costEstimated?: number`
* `costReal?: number`
* `paidBy?: string` (ex: "Joabe", "Comum")


* Criar um mini card de resumo na aba inicial (`Toda a Viagem`):
* Total Estimado vs. Total Gasto.



---

## 6. Sincronização com Google Calendar / Exportação `.ics`

### Objetivo

Permitir que qualquer membro da família baixe o roteiro ou adicione um evento diretamente na agenda do celular.

### Implementação

* Gerar link no formato Google Calendar Web para eventos-chave:
```text
[https://calendar.google.com/calendar/render?action=TEMPLATE&text=Heróis+da+Pizza&dates=20261129T230000Z/20261130T020000Z&details=Aniversário+da+Bruna&location=Heróis+da+Pizza+3a+Avenida](https://calendar.google.com/calendar/render?action=TEMPLATE&text=Heróis+da+Pizza&dates=20261129T230000Z/20261130T020000Z&details=Aniversário+da+Bruna&location=Heróis+da+Pizza+3a+Avenida)

```


* Ou disponibilizar um botão "Adicionar à Agenda" que dispara o download de um arquivo `.ics` com os 12 eventos mapeados.

---

## Diretrizes de Estilo e Consistência (UI)

* Manter o tema escuro com fundos `#121214` / `#1a1a1e` e cartões `#202024`.
* Botões de ação primária: Ciano/Petróleo (`#0B8494` ou `#00fdfb` com texto escuro).
* Manter botões de status (Pendente / Concluído) e os botões `Editar` e `Excluir` alinhados no rodapé de cada card.

```

```