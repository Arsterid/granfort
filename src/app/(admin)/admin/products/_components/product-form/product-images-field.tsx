"use client";

import { Plus, RotateCcw, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useRef, useState, type ChangeEvent } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductImage } from "../product-types";

type ProductImagesFieldProps = {
  images: ProductImage[];
  pendingFiles: File[];
  deletedImageIds: string[];
  onPendingFilesChange: (files: File[]) => void;
  onDeletedImageIdsChange: (ids: string[]) => void;
};

type PreviewItem = {
  file: File;
  url: string;
};

type PendingImageTileProps = {
  file: File;
  previewUrl: string;
  onRemove: () => void;
};

function PendingImageTile({ file, previewUrl, onRemove }: PendingImageTileProps) {
  return (
    <Card className="group border-primary/40 hover:border-primary relative aspect-square overflow-hidden p-0 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <Image
        src={previewUrl}
        alt={file.name}
        fill
        unoptimized
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover transition-transform duration-300 ease-out group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/50 opacity-70 transition-opacity duration-200 group-hover:opacity-100" />

      <Badge className="border-primary/30 bg-background text-foreground hover:bg-background absolute top-2 left-2 z-10 border shadow-sm">
        <Upload className="size-3" />
        Новое
      </Badge>

      <Button
        type="button"
        variant="destructive"
        size="icon-sm"
        aria-label="Убрать новое изображение"
        title="Убрать"
        onClick={onRemove}
        className="absolute top-2 right-2 z-10 shadow-md transition-transform duration-200 hover:scale-105"
      >
        <Trash2 />
      </Button>
    </Card>
  );
}

export function ProductImagesField({
  images,
  pendingFiles,
  deletedImageIds,
  onPendingFilesChange,
  onDeletedImageIdsChange,
}: ProductImagesFieldProps) {
  const inputId = useId();

  const [previews, setPreviews] = useState<PreviewItem[]>([]);
  const activeUrls = useRef(new Set<string>());

  useEffect(() => {
    const activeFiles = new Set(pendingFiles);

    for (const preview of previews) {
      if (!activeFiles.has(preview.file)) {
        URL.revokeObjectURL(preview.url);
        activeUrls.current.delete(preview.url);
      }
    }
  }, [pendingFiles, previews]);

  useEffect(() => {
    const urls = activeUrls.current;

    return () => {
      for (const url of urls) {
        URL.revokeObjectURL(url);
      }

      urls.clear();
    };
  }, []);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    event.target.value = "";

    if (!files.length) return;

    const newPreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    for (const preview of newPreviews) {
      activeUrls.current.add(preview.url);
    }

    setPreviews((current) => [...current, ...newPreviews]);
    onPendingFilesChange([...pendingFiles, ...files]);
  }

  function markForDeletion(imageId: string) {
    if (deletedImageIds.includes(imageId)) {
      onDeletedImageIdsChange(deletedImageIds.filter((id) => id !== imageId));

      return;
    }

    onDeletedImageIdsChange([...deletedImageIds, imageId]);
  }

  function removePendingFile(file: File) {
    onPendingFilesChange(pendingFiles.filter((item) => item !== file));
  }

  return (
    <Card>
      <CardContent className="space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-semibold">Изображения</h2>
            <p className="text-muted-foreground mt-1 text-sm">Фотографии товара.</p>
          </div>

          <Badge variant="outline" className="shrink-0">
            {images.length - deletedImageIds.length + pendingFiles.length} шт.
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image) => {
            const isMarkedForDeletion = deletedImageIds.includes(image.id);

            return (
              <Card
                key={image.id}
                className={`group relative aspect-square overflow-hidden p-0 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
                  isMarkedForDeletion ? "border-destructive/40" : "hover:border-primary/60"
                }`}
              >
                <Image
                  src={image.url}
                  alt={image.altText ?? "Изображение товара"}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className={`object-cover transition-all duration-300 ease-out group-hover:scale-110 ${
                    isMarkedForDeletion ? "opacity-30 grayscale" : ""
                  }`}
                />

                <Button
                  type="button"
                  variant={isMarkedForDeletion ? "secondary" : "destructive"}
                  size="icon-sm"
                  aria-label={isMarkedForDeletion ? "Отменить удаление" : "Пометить на удаление"}
                  title={isMarkedForDeletion ? "Отменить удаление" : "Удалить после сохранения"}
                  onClick={() => markForDeletion(image.id)}
                  className="absolute top-2 right-2 z-10 shadow-md transition-transform duration-200 hover:scale-105"
                >
                  {isMarkedForDeletion ? <RotateCcw /> : <Trash2 />}
                </Button>

                {isMarkedForDeletion && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Badge variant="destructive">Будет удалено</Badge>
                  </div>
                )}
              </Card>
            );
          })}

          {pendingFiles.map((file, index) => {
            const preview = previews.find((item) => item.file === file);

            if (!preview) return null;

            return (
              <PendingImageTile
                key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
                file={file}
                previewUrl={preview.url}
                onRemove={() => removePendingFile(file)}
              />
            );
          })}

          <label htmlFor={inputId} className="block cursor-pointer">
            <Card className="group bg-muted/20 hover:border-primary hover:bg-primary/5 flex aspect-square items-center justify-center border-2 border-dashed transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <CardContent className="flex flex-col items-center gap-2 p-3 text-center">
                <span className="bg-background flex size-12 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110">
                  <Plus className="size-6 transition-transform duration-200 group-hover:rotate-90" />
                </span>

                <span className="group-hover:text-primary text-sm font-medium transition-colors">
                  Добавить фото
                </span>
              </CardContent>
            </Card>
          </label>

          <input
            id={inputId}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="sr-only"
          />
        </div>

        {deletedImageIds.length > 0 && (
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Trash2 className="text-destructive size-4" />
            <span>Будет удалено после сохранения: {deletedImageIds.length}</span>
          </div>
        )}

        {images.length === 0 && pendingFiles.length === 0 && (
          <p className="text-muted-foreground text-sm">
            Изображений пока нет. Нажмите «Добавить фото», чтобы выбрать файлы.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
