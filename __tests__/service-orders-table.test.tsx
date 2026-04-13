import { render, screen } from "@testing-library/react";

import { ServiceOrdersTable } from "@/components/service-orders/service-orders-table";
import type { ServiceOrder } from "@/types/service-order";

describe("ServiceOrdersTable", () => {
  it("renders the service order rows with formatted values", () => {
    const orders: ServiceOrder[] = [
      {
        id: 1,
        orderNumber: "OS-2026-011",
        client: "ACME Industrial",
        description: "Substituição de sensores e calibração do sistema.",
        estimatedValue: 1250,
        status: "in_progress",
        createdAt: "2026-04-13T12:00:00.000Z",
      },
    ];

    render(<ServiceOrdersTable orders={orders} />);

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("OS-2026-011")).toBeInTheDocument();
    expect(screen.getByText("ACME Industrial")).toBeInTheDocument();
    expect(screen.getByText("Substituição de sensores e calibração do sistema.")).toBeInTheDocument();
    expect(screen.getByText("Em andamento")).toBeInTheDocument();
    expect(screen.getByText("13/04/2026")).toBeInTheDocument();
    expect(screen.getByText("R$ 1.250,00")).toBeInTheDocument();
  });
});
