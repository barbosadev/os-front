"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { serviceOrderFormSchema, type ServiceOrderFormValues } from "@/lib/service-order-form-schema";
import { serviceOrderStatusOptions } from "@/types/service-order";

interface ServiceOrdersFormProps {
  onSubmitOrder: (values: ServiceOrderFormValues) => Promise<unknown>;
}

function formatCurrencyInput(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function ServiceOrdersForm({ onSubmitOrder }: Readonly<ServiceOrdersFormProps>) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [estimatedValueMasked, setEstimatedValueMasked] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ServiceOrderFormValues>({
    resolver: zodResolver(serviceOrderFormSchema),
    defaultValues: {
      client: "",
      description: "",
      estimatedValue: 0,
      status: "open",
    },
  });

  const submitHandler = handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      await onSubmitOrder(values);
      reset({
        client: "",
        description: "",
        estimatedValue: 0,
        status: "open",
      });
      setEstimatedValueMasked("");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Não foi possível salvar a ordem.");
    }
  });

  const handleEstimatedValueChange = (rawValue: string) => {
    const onlyDigits = rawValue.replace(/\D/g, "");

    if (!onlyDigits) {
      setEstimatedValueMasked("");
      setValue("estimatedValue", 0, {
        shouldDirty: true,
        shouldValidate: true,
      });
      return;
    }

    const normalizedValue = Number(onlyDigits) / 100;
    setEstimatedValueMasked(formatCurrencyInput(normalizedValue));
    setValue("estimatedValue", normalizedValue, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm shadow-slate-200/60 backdrop-blur">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">Nova ordem de serviço</h2>
        <p className="mt-1 text-sm text-slate-600">
          Cadastre uma ordem e ela entra automaticamente na listagem.
        </p>
      </div>

      <form onSubmit={submitHandler} className="mt-4 space-y-4">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-800">Cliente</span>
          <Input
            {...register("client")}
            placeholder="Nome do cliente"
          />
          {errors.client ? <span className="text-sm text-rose-600">{errors.client.message}</span> : null}
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-800">Descrição</span>
          <Textarea
            {...register("description")}
            rows={4}
            placeholder="Descreva o serviço solicitado"
          />
          {errors.description ? (
            <span className="text-sm text-rose-600">{errors.description.message}</span>
          ) : null}
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-800">Valor estimado</span>
            <Input
              type="text"
              inputMode="decimal"
              value={estimatedValueMasked}
              onChange={(event) => handleEstimatedValueChange(event.target.value)}
              placeholder="0,00"
            />
            {errors.estimatedValue ? (
              <span className="text-sm text-rose-600">{errors.estimatedValue.message}</span>
            ) : null}
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-800">Status inicial</span>
            <Select
              {...register("status")}
            >
              {serviceOrderStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            {errors.status ? <span className="text-sm text-rose-600">{errors.status.message}</span> : null}
          </label>
        </div>

        {submitError ? <p className="text-sm text-rose-600">{submitError}</p> : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-medium tracking-[0.01em] text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 "
          >
            Cancelar
          </Link>
          
          <Button type="submit" variant="primary" size="md" disabled={isSubmitting} className="w-full ">
            {isSubmitting ? "Salvando..." : "Cadastrar ordem"}
          </Button>
        </div>
      </form>
    </section>
  );
}
