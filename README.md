# Ordens de Serviço

Aplicação web em Next.js para gerenciamento de Ordens de Serviço com foco em organização de código, estado global simples e mock de API no App Router.

## Estrutura principal

```text
app/
  api/service-orders/route.ts
  globals.css
  layout.tsx
  page.tsx
components/service-orders/
context/
hooks/
lib/
services/
types/
__tests__/
```

## Decisões técnicas

- App Router como base da aplicação.
- Context API para estado global de ordens, filtros, ordenação e paginação.
- React Hook Form + Zod para o formulário de cadastro.
- API mockada via Route Handler em `app/api/service-orders/route.ts`, cobrindo leitura e criação com um backend local simples.
- Hook derivado `useServiceOrdersView` para concentrar filtro, ordenação e paginação.
- Componentes separados por responsabilidade: formulário, filtros, tabela, resumo e paginação.
- Teste de componente com Jest + Testing Library para validar a tabela com dados formatados.

## Funcionalidades entregues

- Listagem de ordens com número, cliente, descrição, status, data de criação e valor estimado.
- Cadastro em tela dedicada (`/cadastro`) com retorno rápido para a listagem.
- Filtro por cliente e por status.
- Ordenação por data e por valor, com direção crescente ou decrescente.
- Paginação simples.
- Layout responsivo com Tailwind CSS.

## Variáveis de ambiente

O front usa mock local por padrão. Para apontar para a API em produção, configure:

```bash
ORDERS_API_BASE_URL=https://slategray-caribou-222758.hostingersite.com
ORDERS_API_USERNAME=admin
ORDERS_API_PASSWORD=admin123
```

Comportamento:

- Sem `ORDERS_API_BASE_URL`: usa mocks locais em `app/api/service-orders/route.ts`.
- Com `ORDERS_API_BASE_URL`: o route handler faz login automático em `${ORDERS_API_BASE_URL}/auth/login` e usa o token JWT para consumir `${ORDERS_API_BASE_URL}/orders`.
- `ORDERS_API_USERNAME` e `ORDERS_API_PASSWORD` são opcionais. Se não forem definidos, o front usa `admin` / `admin123`.

## Como executar

1. Instale as dependências:

```bash
npm install
```

2. Rode a aplicação:

```bash
npm run dev
```

3. Execute os testes:

```bash
npm test
```

4. Rode o lint:

```bash
npm run lint
```