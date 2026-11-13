import { ArrowUpRight, Car, Package } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <p className="text-brand text-xs font-bold tracking-[0.18em] uppercase">GRANFORT / ADMIN</p>

        <h1 className="text-foreground mt-3 text-3xl font-extrabold tracking-tight">Обзор</h1>

        <p className="text-muted-foreground mt-2 text-sm">
          Добро пожаловать в панель управления GRANFORT.
        </p>
      </div>

      <section className="grid gap-5 md:grid-cols-2">
        <Link
          href="/admin/products"
          className="group focus-visible:ring-ring block rounded-xl focus-visible:ring-2 focus-visible:outline-none"
        >
          <Card className="group-hover:border-brand/40 h-full transition-colors">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div className="space-y-2">
                <CardTitle className="text-lg">Товары и производство</CardTitle>

                <CardDescription>
                  Создание, редактирование и публикация товаров GRANFORT.
                </CardDescription>
              </div>

              <span className="bg-brand/10 text-brand grid size-11 shrink-0 place-items-center rounded-lg">
                <Package className="size-5" />
              </span>
            </CardHeader>

            <CardContent className="border-border text-brand flex items-center justify-between border-t pt-4 text-sm font-semibold">
              <span>Перейти к товарам</span>
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </CardContent>
          </Card>
        </Link>

        <Link
          href="/admin/vehicles/brands"
          className="group focus-visible:ring-ring block rounded-xl focus-visible:ring-2 focus-visible:outline-none"
        >
          <Card className="group-hover:border-brand/40 h-full transition-colors">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div className="space-y-2">
                <CardTitle className="text-lg">Каталог автомобилей</CardTitle>

                <CardDescription>
                  Управление марками, моделями и модификациями автомобилей.
                </CardDescription>
              </div>

              <span className="bg-brand/10 text-brand grid size-11 shrink-0 place-items-center rounded-lg">
                <Car className="size-5" />
              </span>
            </CardHeader>

            <CardContent className="border-border text-brand flex items-center justify-between border-t pt-4 text-sm font-semibold">
              <span>Перейти к каталогу автомобилей</span>
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </CardContent>
          </Card>
        </Link>
      </section>
    </div>
  );
}
