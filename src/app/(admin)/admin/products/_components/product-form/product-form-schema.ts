import { z } from "zod";

export const productFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Введите название товара")
    .max(160, "Название не должно превышать 160 символов"),

  slug: z
    .string()
    .trim()
    .min(1, "Введите URL-адрес товара")
    .max(160, "URL-адрес не должен превышать 160 символов"),

  sku: z.string().max(80, "Артикул не должен превышать 80 символов"),

  description: z.string().max(10_000, "Описание не должно превышать 10 000 символов"),

  sortOrder: z
    .number({ error: "Введите порядок сортировки" })
    .int("Порядок сортировки должен быть целым числом")
    .min(0, "Порядок сортировки не может быть отрицательным")
    .max(1_000_000, "Слишком большое значение порядка сортировки"),

  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),

  compatibilities: z.array(
    z.object({
      vehicleVariantId: z.uuid(),
      fitmentNotes: z.string().trim().max(2000, "Примечание не должно превышать 2000 символов"),
    })
  ),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
