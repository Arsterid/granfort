import Link from "next/link";
import type { ReactNode, SyntheticEvent } from "react";

import { Button } from "@/components/ui/button";

import { AdminPageHeader } from "./admin-page-header";
import { AdminPageLayout } from "./admin-page-layout";

type AdminEntityFormFrameProps = {
  eyebrow: string;
  title: string;
  description: string;
  backHref: string;
  backLabel: string;
  children: ReactNode;
};

type AdminEntityFormProps = AdminEntityFormFrameProps & {
  onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  submitLabel: string;
  submittingLabel?: string;
  destructiveAction?: ReactNode;
  children: ReactNode;
};

export function AdminEntityFormFrame({
  eyebrow,
  title,
  description,
  backHref,
  backLabel,
  children,
}: AdminEntityFormFrameProps) {
  return (
    <AdminPageLayout>
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <Button
          type="button"
          variant="ghost"
          nativeButton={false}
          render={<Link href={backHref} />}
          className="-ml-3"
        >
          ← {backLabel}
        </Button>

        <AdminPageHeader eyebrow={eyebrow} title={title} description={description} />

        {children}
      </div>
    </AdminPageLayout>
  );
}

export function AdminEntityForm({
  onSubmit,
  isSubmitting,
  submitLabel,
  submittingLabel = "Сохранение...",
  destructiveAction,
  children,
  ...frameProps
}: AdminEntityFormProps) {
  return (
    <AdminEntityFormFrame {...frameProps}>
      <form onSubmit={onSubmit} className="space-y-6" noValidate>
        {children}

        <div className="flex flex-wrap items-center gap-2 border-t pt-5">
          {destructiveAction}

          <div className="ml-auto flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              nativeButton={false}
              render={<Link href={frameProps.backHref} />}
            >
              Отмена
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? submittingLabel : submitLabel}
            </Button>
          </div>
        </div>
      </form>
    </AdminEntityFormFrame>
  );
}
