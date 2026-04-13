"use client";

import { useRouter } from "next/navigation";

import { ServiceOrdersForm } from "@/components/service-orders/service-orders-form";
import { useServiceOrdersContext } from "@/context/service-orders-context";

export function ServiceOrdersRegistration() {
  const router = useRouter();
  const { createOrder } = useServiceOrdersContext();

  const handleSubmitOrder = async (values: Parameters<typeof createOrder>[0]) => {
    await createOrder(values);
    router.push("/");
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm shadow-slate-200/60 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Cadastro de ordem de serviço</h1>
          <p className="mt-1 text-sm text-slate-600">
            Preencha os dados abaixo para registrar uma nova solicitação.
          </p>
        </div>
      </header>

      <ServiceOrdersForm onSubmitOrder={handleSubmitOrder} />
    </main>
  );
}
