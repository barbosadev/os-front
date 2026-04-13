import { ServiceOrdersRegistration } from "@/components/service-orders/service-orders-registration";
import { ServiceOrdersProvider } from "@/context/service-orders-context";

export default function CadastroPage() {
  return (
    <ServiceOrdersProvider>
      <ServiceOrdersRegistration />
    </ServiceOrdersProvider>
  );
}
