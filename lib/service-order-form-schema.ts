import { z } from "zod";

const statusValues = ["open", "in_progress", "completed", "canceled"] as const;

export const serviceOrderFormSchema = z.object({
  client: z.string().trim().min(3, "Informe o cliente.").max(80),
  description: z.string().trim().min(10, "A descrição deve ter ao menos 10 caracteres.").max(220),
  estimatedValue: z.number().positive("O valor estimado deve ser maior que zero."),
  status: z.enum(statusValues),
});

export type ServiceOrderFormValues = z.infer<typeof serviceOrderFormSchema>;
