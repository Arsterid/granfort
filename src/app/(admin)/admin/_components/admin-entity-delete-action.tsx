"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

import { apiRequest } from "@/lib/api/api-client";

type BaseProps = {
  entityLabel: string;
  returnHref: string;
  disabled?: boolean;
  disabledReason?: string;
};

type AdminEntityDeleteActionProps = BaseProps &
  (
    | {
        onDelete: () => Promise<unknown>;
        endpoint?: never;
      }
    | {
        endpoint: string;
        onDelete?: never;
      }
  );

export function AdminEntityDeleteAction(props: AdminEntityDeleteActionProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const { entityLabel, returnHref, disabled = false, disabledReason } = props;

  async function handleDelete() {
    if (isDeleting || disabled) return;

    const confirmed = window.confirm(`Удалить ${entityLabel}? Это действие нельзя отменить.`);

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      if (props.onDelete) {
        await props.onDelete();
      } else if (props.endpoint) {
        await apiRequest<void>(props.endpoint, {
          method: "DELETE",
        });
      } else {
        throw new Error("Delete operation is not configured.");
      }

      toast.add({
        title: "Запись удалена",
        description: `${entityLabel} успешно удалён.`,
        type: "success",
      });

      router.push(returnHref);
      router.refresh();
    } catch (error) {
      toast.add({
        title: "Не удалось удалить запись",
        description: error instanceof Error ? error.message : "Попробуйте ещё раз.",
        type: "error",
      });

      setIsDeleting(false);
    }
  }

  return (
    <Button
      type="button"
      variant="destructive"
      size="sm"
      disabled={disabled || isDeleting}
      title={disabled ? disabledReason : "Удалить"}
      onClick={() => void handleDelete()}
    >
      <Trash2 />
      {isDeleting ? "Удаление..." : "Удалить"}
    </Button>
  );
}
