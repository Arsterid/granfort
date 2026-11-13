import { OpenApiGeneratorV31 } from "@asteasolutions/zod-to-openapi";

import { registry } from "./registry";

export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV31(registry.definitions);

  return generator.generateDocument({
    openapi: "3.1.0",

    info: {
      title: "GRANFORT API",
      version: "1.0.0",
      description: "API for the GRANFORT product catalog and administration.",
    },

    servers: [
      {
        url: "/",
        description: "Current application server",
      },
    ],

    tags: [
      {
        name: "Products",
        description: "Product catalog management",
      },
      {
        name: "Vehicle Brands",
        description: "Vehicle manufacturer and brand directory",
      },
      {
        name: "Vehicle Models",
        description: "Vehicle model directory",
      },
      {
        name: "Vehicle Variants",
        description: "Vehicle generations, production years and trim configurations",
      },
    ],
  });
}
