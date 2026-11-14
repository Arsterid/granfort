import type { UseQueryResult } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { AdminEntityFormFrame, type AdminEntityFormFrameProps } from "./admin-entity-form";

type AdminEntityEditorProps<T> = Omit<AdminEntityFormFrameProps, "children"> & {
  query?: Pick<UseQueryResult<T, Error>, "data" | "isPending" | "isError" | "error">;
  loadingMessage: string;
  onRetry?: () => void;
  children: ReactNode;
};

export function AdminEntityEditor<T>({
  query,
  loadingMessage,
  onRetry,
  children,
  ...frameProps
}: AdminEntityEditorProps<T>) {
  if (query && query.data === undefined && query.isPending) {
    return (
      <AdminEntityFormFrame {...frameProps}>
        <Card>
          <CardContent className="text-muted-foreground py-8 text-sm">{loadingMessage}</CardContent>
        </Card>
      </AdminEntityFormFrame>
    );
  }

  if (query && query.data === undefined && query.isError) {
    return (
      <AdminEntityFormFrame {...frameProps}>
        <Card>
          <CardContent className="space-y-4 py-6">
            <p role="alert" className="text-destructive text-sm">
              {query.error instanceof Error ? query.error.message : "Не удалось загрузить запись."}
            </p>

            {onRetry && (
              <Button type="button" variant="outline" onClick={onRetry}>
                Повторить
              </Button>
            )}
          </CardContent>
        </Card>
      </AdminEntityFormFrame>
    );
  }

  if (query && query.data === undefined) {
    return (
      <AdminEntityFormFrame {...frameProps}>
        <Card>
          <CardContent className="text-muted-foreground py-8 text-sm">
            Запись не найдена.
          </CardContent>
        </Card>
      </AdminEntityFormFrame>
    );
  }

  return children;
}
