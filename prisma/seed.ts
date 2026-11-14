import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import * as argon2 from "argon2";
import { Pool } from "pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const variantIds = {
  jacT9: "00000000-0000-4000-8000-000000000901",
  jacT9Premium: "00000000-0000-4000-8000-000000000902",
  havalH3: "00000000-0000-4000-8000-000000000903",
  havalH3Awd: "00000000-0000-4000-8000-000000000904",
};

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || null;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required");
  }

  if (password.length < 16) {
    throw new Error("ADMIN_PASSWORD must contain at least 16 characters");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log(`Admin ${email} already exists. Skipping.`);
    return;
  }

  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
  });

  await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
    },
  });

  console.log(`Admin ${email} created.`);
}

async function seedVehicles() {
  const jac = await prisma.vehicleBrand.upsert({
    where: { slug: "jac" },
    update: {},
    create: {
      name: "JAC",
      slug: "jac",
    },
  });

  const haval = await prisma.vehicleBrand.upsert({
    where: { slug: "haval" },
    update: {},
    create: {
      name: "HAVAL",
      slug: "haval",
    },
  });

  const jacT9 = await prisma.vehicleModel.upsert({
    where: {
      brandId_name: {
        brandId: jac.id,
        name: "T9",
      },
    },
    update: {},
    create: {
      brandId: jac.id,
      name: "T9",
      slug: "t9",
    },
  });

  const havalH3 = await prisma.vehicleModel.upsert({
    where: {
      brandId_name: {
        brandId: haval.id,
        name: "H3",
      },
    },
    update: {},
    create: {
      brandId: haval.id,
      name: "H3",
      slug: "h3",
    },
  });

  console.log("Vehicle brands and models seeded.");

  return { jacT9, havalH3 };
}

async function seedVariants(models: Awaited<ReturnType<typeof seedVehicles>>) {
  const variants = [
    {
      id: variantIds.jacT9,
      vehicleModelId: models.jacT9.id,
      generation: "T9 (2024–2026)",
      yearFrom: 2024,
      yearTo: 2026,
      trim: "2.0T 8AT 4WD",
      notes: "Demonstration fitment. Verify the exact vehicle configuration before commercial use.",
    },
    {
      id: variantIds.jacT9Premium,
      vehicleModelId: models.jacT9.id,
      generation: "T9 (2024–2026)",
      yearFrom: 2024,
      yearTo: 2026,
      trim: "2.0T 8AT 4WD Premium",
      notes: "Demonstration fitment. Verify the exact vehicle configuration before commercial use.",
    },
    {
      id: variantIds.havalH3,
      vehicleModelId: models.havalH3.id,
      generation: "H3 (2024–2026)",
      yearFrom: 2024,
      yearTo: 2026,
      trim: "1.5T DCT 2WD",
      notes: "Demonstration fitment. Verify the exact vehicle configuration before commercial use.",
    },
    {
      id: variantIds.havalH3Awd,
      vehicleModelId: models.havalH3.id,
      generation: "H3 (2024–2026)",
      yearFrom: 2024,
      yearTo: 2026,
      trim: "2.0T DCT 4WD",
      notes: "Demonstration fitment. Verify the exact vehicle configuration before commercial use.",
    },
  ];

  for (const variant of variants) {
    await prisma.vehicleVariant.upsert({
      where: { id: variant.id },
      update: {
        vehicleModelId: variant.vehicleModelId,
        generation: variant.generation,
        yearFrom: variant.yearFrom,
        yearTo: variant.yearTo,
        trim: variant.trim,
        notes: variant.notes,
      },
      create: variant,
    });
  }

  console.log(`${variants.length} vehicle variants seeded.`);
}

async function seedProducts() {
  const products = [
    {
      name: "Расширители колесных арок GRANFORT для JAC T9",
      slug: "granfort-jac-t9-wheel-arch-flares",
      sku: "GF-JT9-EXT-001",
      description:
        "Комплект расширителей колесных арок для JAC T9. Подчеркивает внедорожный характер пикапа, дополняет внешний облик автомобиля и визуально расширяет колесные арки.",
      sortOrder: 10,
      variantIds: [variantIds.jacT9, variantIds.jacT9Premium],
    },
    {
      name: "Боковые пороги GRANFORT для JAC T9",
      slug: "granfort-jac-t9-side-steps",
      sku: "GF-JT9-STEP-001",
      description:
        "Комплект боковых порогов для JAC T9. Практичный элемент внешнего оснащения, который дополняет силуэт пикапа и делает посадку в автомобиль удобнее.",
      sortOrder: 20,
      variantIds: [variantIds.jacT9, variantIds.jacT9Premium],
    },
    {
      name: "Комплект внешнего обвеса GRANFORT для HAVAL H3",
      slug: "granfort-haval-h3-body-kit",
      sku: "GF-H3-KIT-001",
      description:
        "Комплект элементов внешнего оформления для HAVAL H3. Создан для выразительного внедорожного образа и гармонично дополняет дизайн кроссовера.",
      sortOrder: 30,
      variantIds: [variantIds.havalH3, variantIds.havalH3Awd],
    },
    {
      name: "Защитный комплект GRANFORT для HAVAL H3",
      slug: "granfort-haval-h3-protection-kit",
      sku: "GF-H3-GUARD-001",
      description:
        "Комплект внешних защитных элементов для HAVAL H3. Дополняет внедорожный стиль автомобиля и подходит для создания единого образа GRANFORT.",
      sortOrder: 40,
      variantIds: [variantIds.havalH3, variantIds.havalH3Awd],
    },
  ];

  for (const item of products) {
    const { variantIds: compatibleVariants, ...productData } = item;

    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {
        ...productData,
        status: "PUBLISHED",
      },
      create: {
        ...productData,
        status: "PUBLISHED",
      },
    });

    await prisma.productVehicle.createMany({
      data: compatibleVariants.map((vehicleVariantId) => ({
        productId: product.id,
        vehicleVariantId,
      })),
      skipDuplicates: true,
    });
  }

  console.log(`${products.length} products seeded.`);
  console.log("Product compatibility links seeded.");
}

async function main() {
  console.log("Starting GRANFORT database seed...");

  await seedAdmin();

  const models = await seedVehicles();

  await seedVariants(models);

  await seedProducts();

  console.log("GRANFORT database seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
