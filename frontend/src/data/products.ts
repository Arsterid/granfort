export type Product = {
  id: string;
  model: string;
  category: string;
  description: string;
  code: string;
  vehicleType: "pickup" | "suv";
  features: string[];
};

export const products: Product[] = [
  {
    id: "jac-t9",
    model: "JAC T9",
    category: "Пикап",
    description: "Готовый комплект защиты переднего и заднего бамперов для JAC T9.",
    code: "GF — 001",
    vehicleType: "pickup",
    features: [
      "Разработка под конкретную модель",
      "Установка без сверления кузова",
      "Несколько вариантов исполнения",
    ],
  },
  {
    id: "haval-h3",
    model: "HAVAL H3",
    category: "Внедорожник",
    description: "Готовый комплект защиты переднего и заднего бамперов для Haval H3.",
    code: "GF — 002",
    vehicleType: "suv",
    features: [
      "Разработка под конкретную модель",
      "Установка без сверления кузова",
      "Несколько вариантов исполнения",
    ],
  },
];

export const productMaterials = [
  {
    name: "AISI 304",
    description: "Нержавеющая сталь с зеркальной полировкой",
  },
  {
    name: "Порошковое покрытие",
    description: "Чёрный металл с защитным покрытием",
  },
];
