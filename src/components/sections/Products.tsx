import { ArrowUpRight, ImageIcon, Package } from "lucide-react";
import Image from "next/image";

import { productMaterials } from "@/data/products";
import { toPublicProductDto, type PublicProductDto } from "@/server/products/product.dto";
import { productService } from "@/server/products/product.service";

function formatYearRange(yearFrom: number | null, yearTo: number | null) {
  if (yearFrom !== null && yearTo !== null) {
    return yearFrom === yearTo ? String(yearFrom) : `${yearFrom}–${yearTo}`;
  }

  if (yearFrom !== null) return `с ${yearFrom}`;
  if (yearTo !== null) return `до ${yearTo}`;

  return null;
}

function formatCompatibility(compatibility: PublicProductDto["compatibilities"][number]) {
  const vehicleName = [compatibility.model.brand.name, compatibility.model.name].join(" ");

  const details = [
    compatibility.generation,
    formatYearRange(compatibility.yearFrom, compatibility.yearTo),
    compatibility.trim,
  ].filter((part): part is string => Boolean(part));

  return {
    vehicleName,
    details: details.join(" · "),
  };
}

function ProductCard({
  product,
  index,
  total,
}: {
  product: PublicProductDto;
  index: number;
  total: number;
}) {
  const image = product.images[0];
  const firstCompatibility = product.compatibilities[0];

  const watermark = firstCompatibility
    ? `${firstCompatibility.model.brand.name} ${firstCompatibility.model.name}`
    : product.name;

  const displayedCompatibilities = product.compatibilities.slice(0, 3);
  const remainingCompatibilities = product.compatibilities.length - displayedCompatibilities.length;

  return (
    <article className="group bg-card hover:border-brand/30 min-w-0 overflow-hidden border transition-[border-color,transform,box-shadow] duration-[220ms] ease-[ease] hover:-translate-y-[5px] hover:shadow-[0_18px_50px_rgba(30,25,25,0.08)]">
      <div className="text-on-dark relative flex min-h-[300px] items-center justify-center overflow-hidden bg-[image:var(--visual-panel-background)] max-[900px]:min-h-[240px] max-[650px]:min-h-[270px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[image:var(--visual-grid-background)] bg-size-[38px_38px]"
        />

        <div className="text-micro text-on-dark/60 absolute top-[23px] right-[25px] left-[25px] z-20 flex items-center justify-between gap-3 font-extrabold tracking-[0.14em]">
          <span className="truncate">{product.sku ? `SKU · ${product.sku}` : "GRANFORT"}</span>
          <span className="shrink-0">READY SOLUTION</span>
        </div>

        <div className="text-on-dark/[0.055] pointer-events-none absolute top-[48%] left-1/2 max-w-full -translate-x-1/2 -translate-y-1/2 overflow-hidden text-[clamp(48px,7vw,90px)] font-black tracking-[-0.09em] whitespace-nowrap">
          {watermark}
        </div>

        <div className="relative z-10 h-[250px] w-full overflow-hidden max-[600px]:h-[220px]">
          {image ? (
            <Image
              src={image.url}
              alt={image.altText || product.name}
              fill
              sizes="(max-width: 650px) 100vw, (max-width: 900px) 50vw, 50vw"
              className="object-contain object-center transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[7px] group-hover:scale-[1.015]"
            />
          ) : (
            <div className="text-on-dark/55 flex h-full flex-col items-center justify-center gap-3">
              <ImageIcon className="size-9" strokeWidth={1.3} />
              <span className="text-micro font-extrabold tracking-[0.14em]">
                ИЗОБРАЖЕНИЕ ГОТОВИТСЯ
              </span>
            </div>
          )}
        </div>

        <div className="text-micro text-on-dark/65 absolute right-[25px] bottom-5 left-[25px] z-20 flex items-center justify-between gap-3 font-extrabold tracking-[0.12em]">
          <span>СОВМЕСТИМОСТЬ</span>
          <span className="shrink-0">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="p-[29px] pt-[29px] pb-[25px] max-[900px]:px-5 max-[900px]:py-[23px] max-[650px]:px-[23px] max-[650px]:py-[25px]">
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            <span className="text-micro text-brand font-black tracking-[0.16em]">
              ПРОДУКЦИЯ GRANFORT
            </span>

            <h3 className="mt-2 text-[29px] font-black tracking-[-0.055em] break-words">
              {product.name}
            </h3>
          </div>

          <span className="text-foreground/10 shrink-0 text-4xl leading-none font-black">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {product.description && (
          <p className="text-muted-foreground mt-[17px] mb-5 max-w-[420px] text-xs leading-[1.85]">
            {product.description}
          </p>
        )}

        <div className="border-t pt-[19px] pb-[22px]">
          <p className="text-micro text-brand mb-4 font-black tracking-[0.16em]">ПОДХОДИТ ДЛЯ</p>

          {displayedCompatibilities.length > 0 ? (
            <ul className="m-0 flex list-none flex-col gap-3 px-0">
              {displayedCompatibilities.map((compatibility) => {
                const display = formatCompatibility(compatibility);

                return (
                  <li
                    key={compatibility.vehicleVariantId}
                    className="text-caption text-foreground flex items-start gap-[11px] font-bold"
                  >
                    <span aria-hidden="true" className="text-brand mt-px text-sm font-black">
                      ✓
                    </span>

                    <span className="min-w-0">
                      <span className="block">{display.vehicleName}</span>

                      {display.details && (
                        <span className="text-muted-foreground mt-1 block text-xs leading-[1.6] font-medium">
                          {display.details}
                        </span>
                      )}
                    </span>
                  </li>
                );
              })}

              {remainingCompatibilities > 0 && (
                <li className="text-muted-foreground pl-[23px] text-xs font-medium">
                  И ещё {remainingCompatibilities}{" "}
                  {remainingCompatibilities === 1
                    ? "модификация"
                    : remainingCompatibilities < 5
                      ? "модификации"
                      : "модификаций"}
                </li>
              )}
            </ul>
          ) : (
            <p className="text-muted-foreground text-xs">Совместимость уточняется.</p>
          )}
        </div>

        <a
          href="#contacts"
          className="group/action text-brand flex items-center justify-between gap-[15px] border-t pt-[19px] text-xs font-black"
        >
          <span>Запросить товар</span>

          <ArrowUpRight className="size-5 transition-transform duration-[220ms] ease-[ease] group-hover/action:translate-x-1 group-hover/action:-translate-y-1" />
        </a>
      </div>
    </article>
  );
}

function ProductMaterials() {
  return (
    <div className="bg-card/55 mt-[55px] grid grid-cols-[0.7fr_1.3fr] gap-10 border px-8 py-[29px] max-[900px]:grid-cols-1 max-[900px]:gap-[25px] max-[650px]:mt-[30px] max-[650px]:px-5 max-[650px]:py-6">
      <div>
        <span className="text-micro text-brand font-black tracking-[0.16em]">
          ВАРИАНТЫ ИСПОЛНЕНИЯ
        </span>

        <p className="text-compact text-foreground mt-2.5 max-w-[260px] leading-[1.7] font-extrabold">
          Подбирайте материал и внешний вид под свои задачи.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 max-[650px]:grid-cols-1 max-[650px]:gap-5">
        {productMaterials.map((material, index) => (
          <div key={material.name} className="flex items-start gap-[14px]">
            <span className="text-micro text-brand font-black">
              {String(index + 1).padStart(2, "0")}
            </span>

            <div className="flex flex-col gap-[6px]">
              <strong className="text-xs font-black">{material.name}</strong>

              <span className="text-micro text-muted-foreground leading-[1.7]">
                {material.description}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function Products() {
  const productRecords = await productService.getPublished();
  const products = productRecords.map(toPublicProductDto);

  return (
    <section
      id="products"
      aria-labelledby="products-title"
      className="bg-background py-[110px] pb-[120px] max-[900px]:py-[85px] max-[650px]:py-[70px]"
    >
      <div className="max-w-site mx-auto w-[calc(100%_-_64px)] max-[560px]:w-[calc(100%_-_36px)]">
        <div className="mb-12 grid grid-cols-[1fr_0.65fr] items-end gap-[50px] max-[900px]:grid-cols-1 max-[900px]:gap-[18px] max-[650px]:mb-[30px]">
          <div>
            <div className="text-micro text-brand flex items-center gap-3 font-extrabold tracking-[0.15em] uppercase">
              <span className="bg-brand h-0.5 w-8" />
              Наша продукция
            </div>

            <h2
              id="products-title"
              className="text-section-title-lg mt-[23px] max-w-[650px] font-black tracking-[-0.06em] max-[650px]:text-[clamp(34px,9vw,44px)]"
            >
              Готовые решения для <span className="text-brand">вашего автомобиля.</span>
            </h2>
          </div>

          <p className="text-compact text-muted-foreground mb-[5px] ml-auto max-w-[440px] leading-[1.9] max-[900px]:m-0">
            Разрабатываем продукцию с учётом особенностей конкретных автомобилей. Выберите
            подходящее решение и проверьте его совместимость с вашей моделью.
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 max-[900px]:gap-4 max-[650px]:grid-cols-1 max-[650px]:gap-5">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                total={products.length}
              />
            ))}
          </div>
        ) : (
          <div className="bg-card/55 flex flex-col items-center border px-6 py-14 text-center">
            <Package className="text-muted-foreground size-9" strokeWidth={1.3} />

            <h3 className="mt-4 text-lg font-bold">Каталог готовых решений пока пуст</h3>

            <p className="text-muted-foreground mt-2 max-w-md text-sm leading-relaxed">
              Свяжитесь с нами, чтобы обсудить ваш автомобиль и подобрать подходящее решение.
            </p>

            <a
              href="#contacts"
              className="text-brand mt-5 inline-flex items-center gap-2 text-sm font-bold"
            >
              Связаться с нами
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        )}

        <ProductMaterials />
      </div>
    </section>
  );
}
