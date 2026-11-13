"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

type ProductDeleteActionProps = {
  productId: string;
  productName: string;
};

export function ProductDeleteAction({ productId, productName }: ProductDeleteActionProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (isDeleting) return;

    const confirmed = window.confirm(
      `Удалить товар «${productName}»? Это действие нельзя отменить.`
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/v1/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error();
      }

      toast.add({
        title: "Товар удалён",
        description: "Товар успешно удалён.",
        type: "success",
      });

      router.push("/admin/products");
      router.refresh();
    } catch {
      toast.add({
        title: "Не удалось удалить товар",
        description: "Попробуйте ещё раз.",
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
      disabled={isDeleting}
      onClick={() => void handleDelete()}
    >
      <Trash2 />
      {isDeleting ? "Удаление..." : "Удалить"}
    </Button>
  );
}
