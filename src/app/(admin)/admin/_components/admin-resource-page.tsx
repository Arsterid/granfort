import type { ReactNode } from "react";

import { AdminDataToolbar } from "./admin-data-toolbar";
import { AdminPageHeader } from "./admin-page-header";
import { AdminPageLayout } from "./admin-page-layout";

import { AdminDataTable, type AdminDataTableColumn } from "./admin-data-table";

type AdminResourcePageProps<T> = {
  eyebrow: string;
  title: string;
  description: string;
  headerActions?: ReactNode;

  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;

  tableTitle: string;
  tableDescription?: string;
  data: T[];
  columns: AdminDataTableColumn<T>[];
  getRowId: (row: T) => string;
  getRowLabel?: (row: T) => string;
  onRowClick?: (row: T) => void;
  renderActions?: (row: T) => ReactNode;

  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyMessage?: string;
  emptyAction?: ReactNode;
};

export function AdminResourcePage<T>({
  eyebrow,
  title,
  description,
  headerActions,
  search,
  onSearchChange,
  searchPlaceholder,
  filters,
  tableTitle,
  tableDescription,
  data,
  columns,
  getRowId,
  getRowLabel,
  onRowClick,
  renderActions,
  isLoading,
  error,
  onRetry,
  emptyMessage,
  emptyAction,
}: AdminResourcePageProps<T>) {
  return (
    <AdminPageLayout>
      <AdminPageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={headerActions}
      />

      <AdminDataToolbar
        search={search}
        onSearchChange={onSearchChange}
        searchPlaceholder={searchPlaceholder}
        filters={filters}
      />

      <AdminDataTable
        title={tableTitle}
        description={tableDescription}
        data={data}
        columns={columns}
        getRowId={getRowId}
        getRowLabel={getRowLabel}
        onRowClick={onRowClick}
        renderActions={renderActions}
        isLoading={isLoading}
        error={error}
        onRetry={onRetry}
        emptyMessage={emptyMessage}
        emptyAction={emptyAction}
      />
    </AdminPageLayout>
  );
}
