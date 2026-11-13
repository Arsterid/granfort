declare module "swagger-ui-react" {
  import type { ComponentType } from "react";

  interface SwaggerUIProps {
    url?: string;
    docExpansion?: "list" | "full" | "none";
    deepLinking?: boolean;
    displayRequestDuration?: boolean;
    defaultModelsExpandDepth?: number;
    filter?: boolean | string;
    tryItOutEnabled?: boolean;
    withCredentials?: boolean;
    supportedSubmitMethods?: string[];
    validatorUrl?: string | null;
  }

  const SwaggerUI: ComponentType<SwaggerUIProps>;

  export default SwaggerUI;
}
