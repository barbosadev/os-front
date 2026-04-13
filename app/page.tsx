import { ServiceOrdersDashboard } from "@/components/service-orders/service-orders-dashboard";
import { ServiceOrdersProvider } from "@/context/service-orders-context";

export default function Home() {
  return (
    <ServiceOrdersProvider>
      <ServiceOrdersDashboard />
    </ServiceOrdersProvider>
  );
}
