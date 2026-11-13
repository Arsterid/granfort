"use client";

import dynamic from "next/dynamic";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
  ssr: false,
  loading: () => <div className="p-8 text-center">Loading API documentation...</div>,
});

export default function SwaggerViewer() {
  return (
    <SwaggerUI
      url="/api/openapi.json"
      docExpansion="list"
      deepLinking
      displayRequestDuration
      defaultModelsExpandDepth={-1}
      filter
      tryItOutEnabled
      withCredentials
      validatorUrl="none"
    />
  );
}
