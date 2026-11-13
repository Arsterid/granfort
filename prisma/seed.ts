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

  await prisma.vehicleModel.upsert({
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

  await prisma.vehicleModel.upsert({
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
}

async function main() {
  await seedAdmin();
  await seedVehicles();
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
