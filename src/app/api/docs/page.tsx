import "swagger-ui-react/swagger-ui.css";

import SwaggerViewer from "@/components/api-docs/swagger-viewer";

export const metadata = {
  title: "GRANFORT API Documentation",
};

export default function ApiDocsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1440px] px-4 py-8">
        <SwaggerViewer />
      </div>
    </main>
  );
}
