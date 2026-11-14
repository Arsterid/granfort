"use client";

import {
  AlertCircle,
  Archive,
  ArrowUpRight,
  Car,
  CheckCircle2,
  Package,
  Plus,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import type { AdminOverviewDto } from "@/server/admin-overview/admin-overview.dto";

import { useAdminOverview } from "../_hooks/use-admin-overview";
import { ProductStatusBadge } from "../products/_components/product-status-badge";
import { AdminPageHeader } from "./admin-page-header";

type ProductSummary = AdminOverviewDto["recentProducts"][number];

function formatCount(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-3 p-5">
        <div className="min-w-0">
          <p className="text-muted-foreground text-sm">{title}</p>

          <p className="mt-2 text-3xl font-bold tracking-tight tabular-nums">
            {formatCount(value)}
          </p>

          <p className="text-muted-foreground mt-1 text-xs">{description}</p>
        </div>

        <span className="bg-brand/10 text-brand grid size-10 shrink-0 place-items-center rounded-lg">
          <Icon className="size-5" />
        </span>
      </CardContent>
    </Card>
  );
}

function VehicleCountRow({ label, count, href }: { label: string; count: number; href: string }) {
  return (
    <Link
      href={href}
      className="hover:bg-muted/60 focus-visible:bg-muted/60 flex items-center justify-between rounded-md px-3 py-2 transition-colors focus-visible:outline-none"
    >
      <span className="text-sm">{label}</span>

      <span className="flex items-center gap-2">
        <span className="text-muted-foreground text-sm tabular-nums">{formatCount(count)}</span>
        <ArrowUpRight className="text-muted-foreground size-3.5" />
      </span>
    </Link>
  );
}

function QuickAction({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="hover:bg-muted/60 focus-visible:bg-muted/60 flex items-center gap-3 rounded-lg border p-3 transition-colors focus-visible:outline-none"
    >
      <span className="bg-brand/10 text-brand grid size-9 shrink-0 place-items-center rounded-md">
        <Plus className="size-4" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">{title}</span>
        <span className="text-muted-foreground block text-xs">{description}</span>
      </span>

      <ArrowUpRight className="text-muted-foreground size-4 shrink-0" />
    </Link>
  );
}

function getIssueLabel(issue: "NO_IMAGES" | "NO_COMPATIBILITIES") {
  return issue === "NO_IMAGES" ? "Нет изображений" : "Нет совместимостей";
}

function AttentionSection({ data }: { data: AdminOverviewDto["attention"] }) {
  const hasIssues = data.draftsWithoutCompatibilities > 0 || data.activeProductsWithoutImages > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          {hasIssues ? (
            <AlertCircle className="text-muted-foreground size-5" />
          ) : (
            <CheckCircle2 className="text-muted-foreground size-5" />
          )}

          <CardTitle className="text-base">Требуют внимания</CardTitle>
        </div>

        <CardDescription>Проверка заполнения товарного каталога.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-muted-foreground text-xs">Черновики без совместимостей</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">
              {formatCount(data.draftsWithoutCompatibilities)}
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-muted-foreground text-xs">Активные товары без изображений</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">
              {formatCount(data.activeProductsWithoutImages)}
            </p>
          </div>
        </div>

        {data.items.length > 0 ? (
          <div className="divide-y">
            {data.items.map((product) => (
              <AttentionProductRow key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed px-4 py-6 text-center">
            <CheckCircle2 className="text-muted-foreground mx-auto size-6" />
            <p className="mt-2 text-sm font-medium">Всё в порядке</p>
            <p className="text-muted-foreground mt-1 text-xs">
              Не найдено товаров с указанными проблемами.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AttentionProductRow({
  product,
}: {
  product: AdminOverviewDto["attention"]["items"][number];
}) {
  return (
    <Link
      href={`/admin/products/${product.id}`}
      className="hover:bg-muted/50 flex flex-col gap-2 rounded-md px-3 py-3 transition-colors sm:flex-row sm:items-center sm:justify-between"
    >
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium">{product.name}</span>

        <span className="text-muted-foreground mt-0.5 block text-xs">
          {formatDate(product.updatedAt)}
        </span>
      </span>

      <span className="flex flex-wrap gap-1.5">
        {product.issues.map((issue) => (
          <Badge key={issue} variant="outline" className="font-normal">
            {getIssueLabel(issue)}
          </Badge>
        ))}
      </span>
    </Link>
  );
}

function RecentProductRow({ product }: { product: ProductSummary }) {
  return (
    <Link
      href={`/admin/products/${product.id}`}
      className="hover:bg-muted/50 flex items-center justify-between gap-3 rounded-md px-3 py-3 transition-colors"
    >
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{product.name}</span>

        <span className="text-muted-foreground mt-0.5 block text-xs">
          {product.imagesCount} изображений · {product.compatibilitiesCount} модификаций ·{" "}
          {formatDate(product.updatedAt)}
        </span>
      </span>

      <span className="flex shrink-0 items-center gap-2">
        <ProductStatusBadge status={product.status} />
        <ArrowUpRight className="text-muted-foreground size-4" />
      </span>
    </Link>
  );
}

function RecentProductsSection({ products }: { products: AdminOverviewDto["recentProducts"] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base">Последние изменения</CardTitle>
          <CardDescription>Недавно обновлённые товары.</CardDescription>
        </div>

        <Button
          nativeButton={false}
          render={<Link href="/admin/products" />}
          variant="outline"
          size="sm"
        >
          Все товары
        </Button>
      </CardHeader>

      <CardContent>
        {products.length > 0 ? (
          <div className="divide-y">
            {products.map((product) => (
              <RecentProductRow key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed px-4 py-8 text-center">
            <Package className="text-muted-foreground mx-auto size-6" />
            <p className="mt-2 text-sm font-medium">Товаров пока нет</p>
            <p className="text-muted-foreground mt-1 text-xs">
              Создайте первый товар, чтобы начать наполнять каталог.
            </p>
            <Button
              nativeButton={false}
              render={<Link href="/admin/products/new" />}
              size="sm"
              className="mt-4"
            >
              <Plus className="size-4" />
              Создать товар
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function VehicleCatalogSection({ data }: { data: AdminOverviewDto["vehicles"] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Car className="text-muted-foreground size-5" />
          <CardTitle className="text-base">Автомобильный каталог</CardTitle>
        </div>
        <CardDescription>Структура базы совместимости товаров.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-1">
        <VehicleCountRow
          label="Марки автомобилей"
          count={data.brands}
          href="/admin/vehicles/brands"
        />

        <VehicleCountRow label="Модели" count={data.models} href="/admin/vehicles/models" />

        <VehicleCountRow
          label="Модификации"
          count={data.variants}
          href="/admin/vehicles/variants"
        />
      </CardContent>
    </Card>
  );
}

function QuickActionsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Быстрые действия</CardTitle>
        <CardDescription>Основные операции с каталогом.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        <QuickAction
          href="/admin/products/new"
          title="Добавить товар"
          description="Создать новую товарную позицию"
        />

        <QuickAction
          href="/admin/vehicles/brands/new"
          title="Добавить марку"
          description="Начать заполнение автомобильного каталога"
        />

        <QuickAction
          href="/admin/vehicles/variants/new"
          title="Добавить модификацию"
          description="Добавить поколение или комплектацию"
        />
      </CardContent>
    </Card>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Card key={index}>
            <CardContent className="space-y-3 p-5">
              <div className="bg-muted h-4 w-28 animate-pulse rounded" />
              <div className="bg-muted h-8 w-20 animate-pulse rounded" />
              <div className="bg-muted h-3 w-36 animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]">
        <div className="bg-muted h-80 animate-pulse rounded-xl" />
        <div className="bg-muted h-80 animate-pulse rounded-xl" />
      </div>
    </div>
  );
}

export function AdminOverview() {
  const { data, isPending, isFetching, error, refetch } = useAdminOverview();

  const errorMessage =
    error instanceof Error ? error.message : "Не удалось загрузить обзор каталога.";

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <AdminPageHeader
        eyebrow="GRANFORT / ADMIN"
        title="Обзор"
        description="Состояние товарного и автомобильного каталогов."
        actions={
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => void refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
            Обновить
          </Button>
        }
      />

      {isPending ? (
        <OverviewSkeleton />
      ) : error || !data ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <AlertCircle className="text-destructive size-8" />
            <div>
              <p className="font-medium">Не удалось загрузить обзор</p>
              <p className="text-muted-foreground mt-1 text-sm">{errorMessage}</p>
            </div>
            <Button type="button" variant="outline" onClick={() => void refetch()}>
              <RefreshCw className="size-4" />
              Повторить
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="Всего товаров"
              value={data.products.total}
              description="Все товарные позиции"
              icon={Package}
            />

            <MetricCard
              title="Опубликовано"
              value={data.products.published}
              description="Доступны покупателям"
              icon={CheckCircle2}
            />

            <MetricCard
              title="Черновики"
              value={data.products.drafts}
              description="Ещё не опубликованы"
              icon={Plus}
            />

            <MetricCard
              title="В архиве"
              value={data.products.archived}
              description="Не участвуют в продаже"
              icon={Archive}
            />
          </section>

          <section className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]">
            <div className="space-y-4">
              <AttentionSection data={data.attention} />
              <RecentProductsSection products={data.recentProducts} />
            </div>

            <div className="space-y-4">
              <VehicleCatalogSection data={data.vehicles} />
              <QuickActionsSection />
            </div>
          </section>
        </>
      )}
    </div>
  );
}
