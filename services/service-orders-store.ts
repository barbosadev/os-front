import type { CreateServiceOrderInput, ServiceOrder } from "@/types/service-order";

function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

export const serviceOrdersSeed: ServiceOrder[] = [
  {
    id: 1,
    orderNumber: "OS-2026-001",
    client: "Alfa Automação Ltda.",
    description: "Manutenção corretiva no painel elétrico da linha de embalagem.",
    estimatedValue: 4800,
    status: "open",
    createdAt: daysAgo(1),
  },
  {
    id: 2,
    orderNumber: "OS-2026-002",
    client: "Bella Foods",
    description: "Instalação de sensores de temperatura no setor de resfriamento.",
    estimatedValue: 7600,
    status: "in_progress",
    createdAt: daysAgo(2),
  },
  {
    id: 3,
    orderNumber: "OS-2026-003",
    client: "Construtora Horizonte",
    description: "Revisão preventiva das bombas hidráulicas do canteiro principal.",
    estimatedValue: 12500,
    status: "completed",
    createdAt: daysAgo(4),
  },
  {
    id: 4,
    orderNumber: "OS-2026-004",
    client: "Delta Climatização",
    description: "Ajuste fino do sistema de exaustão do galpão de pintura.",
    estimatedValue: 3200,
    status: "open",
    createdAt: daysAgo(5),
  },
  {
    id: 5,
    orderNumber: "OS-2026-005",
    client: "Eco Farma",
    description: "Calibração dos equipamentos de medição do laboratório de qualidade.",
    estimatedValue: 8900,
    status: "in_progress",
    createdAt: daysAgo(7),
  },
  {
    id: 6,
    orderNumber: "OS-2026-006",
    client: "Flex Logistics",
    description: "Troca de atuadores e verificação do transportador automatizado.",
    estimatedValue: 15400,
    status: "completed",
    createdAt: daysAgo(9),
  },
  {
    id: 7,
    orderNumber: "OS-2026-007",
    client: "Global Shop",
    description: "Atualização do sistema de controle das docas de expedição.",
    estimatedValue: 5400,
    status: "canceled",
    createdAt: daysAgo(11),
  },
  {
    id: 8,
    orderNumber: "OS-2026-008",
    client: "Hera Metalúrgica",
    description: "Inspeção estrutural e reforço dos suportes de bancada.",
    estimatedValue: 11200,
    status: "open",
    createdAt: daysAgo(13),
  },
];

export function createServiceOrderRecord(
  input: CreateServiceOrderInput,
  currentOrders: ServiceOrder[],
): ServiceOrder {
  const nextId = currentOrders.length === 0 ? 1 : Math.max(...currentOrders.map((order) => order.id)) + 1;
  const nextNumber = currentOrders.length + 1;

  return {
    id: nextId,
    orderNumber: `OS-2026-${String(nextNumber).padStart(3, "0")}`,
    client: input.client,
    description: input.description,
    estimatedValue: input.estimatedValue,
    status: input.status,
    createdAt: new Date().toISOString(),
  };
}
