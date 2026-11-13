import type { KeyboardEvent, MouseEvent, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type AdminDataTableColumn<T> = {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  width?: string;
  className?: string;
  headerClassName?: string;
  truncate?: boolean;
};

type AdminDataTableProps<T> = {
  title: string;
  description?: string;
  data: T[];
  columns: AdminDataTableColumn<T>[];
  getRowId: (row: T) => string;
  getRowLabel?: (row: T) => string;
  onRowClick?: (row: T) => void;
  renderActions?: (row: T) => ReactNode;
  emptyMessage?: string;
  emptyAction?: ReactNode;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
};

function isInteractiveTarget(target: EventTarget | null) {
  return (
    target instanceof Element &&
    Boolean(
      target.closest("a, button, input, select, textarea, [role='button'], [data-row-action]")
    )
  );
}

export function AdminDataTable<T>({
  title,
  description,
  data,
  columns,
  getRowId,
  getRowLabel,
  onRowClick,
  renderActions,
  emptyMessage = "Нет данных.",
  emptyAction,
  isLoading = false,
  error,
  onRetry,
}: AdminDataTableProps<T>) {
  function handleRowClick(event: MouseEvent<HTMLTableRowElement>, row: T) {
    if (!onRowClick || isInteractiveTarget(event.target)) return;

    onRowClick(row);
  }

  function handleRowKeyDown(event: KeyboardEvent<HTMLTableRowElement>, row: T) {
    if (!onRowClick || event.target !== event.currentTarget) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onRowClick(row);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>

        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent>
        {error && data.length > 0 && (
          <div
            role="alert"
            className="border-destructive/30 mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md border p-3"
          >
            <p className="text-destructive text-sm">{error}</p>

            {onRetry && (
              <Button type="button" variant="outline" size="sm" onClick={onRetry}>
                Повторить
              </Button>
            )}
          </div>
        )}

        {isLoading && data.length === 0 ? (
          <div className="text-muted-foreground py-12 text-center text-sm">Загрузка...</div>
        ) : error && data.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-destructive text-sm">{error}</p>

            {onRetry && (
              <Button type="button" variant="outline" onClick={onRetry}>
                Повторить
              </Button>
            )}
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-muted-foreground text-sm">{emptyMessage}</p>
            {emptyAction}
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[760px] table-fixed">
              <colgroup>
                {columns.map((column) => (
                  <col key={column.id} style={column.width ? { width: column.width } : undefined} />
                ))}

                {renderActions && <col style={{ width: "10%" }} />}
              </colgroup>

              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead
                      key={column.id}
                      className={`overflow-hidden text-ellipsis whitespace-nowrap ${column.headerClassName ?? ""}`}
                    >
                      {column.header}
                    </TableHead>
                  ))}

                  {renderActions && <TableHead className="text-right">Действия</TableHead>}
                </TableRow>
              </TableHeader>

              <TableBody>
                {data.map((row) => (
                  <TableRow
                    key={getRowId(row)}
                    tabIndex={onRowClick ? 0 : undefined}
                    aria-label={getRowLabel?.(row)}
                    className={
                      onRowClick
                        ? "hover:bg-muted/50 focus-visible:ring-ring cursor-pointer transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
                        : undefined
                    }
                    onClick={(event) => handleRowClick(event, row)}
                    onKeyDown={(event) => handleRowKeyDown(event, row)}
                  >
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        className={`overflow-hidden ${column.className ?? ""}`}
                      >
                        <div
                          className={
                            column.truncate === false
                              ? "min-w-0 break-words whitespace-normal"
                              : "min-w-0 truncate"
                          }
                        >
                          {column.cell(row)}
                        </div>
                      </TableCell>
                    ))}

                    {renderActions && (
                      <TableCell
                        className="text-right"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <div className="flex justify-end gap-1">{renderActions(row)}</div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
