import { productMaterials, products } from "@/data/products";
import { assetPath } from "@/lib/assetPath";
import Image from "next/image";

export default function Products() {
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
            Разрабатываем защиту с учётом особенностей конкретной модели. Сейчас в линейке — два
            готовых комплекта для популярных внедорожников и пикапов.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 max-[900px]:gap-4 max-[650px]:grid-cols-1 max-[650px]:gap-5">
          {products.map((product, index) => {
            const image =
              product.vehicleType === "pickup" ? "/images/jac-t9.png" : "/images/haval-h3.png";

            return (
              <article
                key={product.id}
                className="group bg-card hover:border-brand/30 min-w-0 overflow-hidden border transition-[border-color,transform,box-shadow] duration-[220ms] ease-[ease] hover:-translate-y-[5px] hover:shadow-[0_18px_50px_rgba(30,25,25,0.08)]"
              >
                <div className="text-on-dark relative flex min-h-[300px] items-center justify-center overflow-hidden bg-[image:var(--visual-panel-background)] max-[900px]:min-h-[240px] max-[650px]:min-h-[270px]">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[image:var(--visual-grid-background)] bg-size-[38px_38px]"
                  />

                  <div className="text-micro text-on-dark/60 absolute top-[23px] right-[25px] left-[25px] z-20 flex items-center justify-between font-extrabold tracking-[0.14em]">
                    <span>{product.code}</span>
                    <span>READY SOLUTION</span>
                  </div>

                  <div className="text-on-dark/[0.055] pointer-events-none absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[clamp(64px,8vw,100px)] font-black tracking-[-0.09em] whitespace-nowrap max-[650px]:text-[90px]">
                    {product.model}
                  </div>

                  <div className="relative z-10 h-[250px] w-full overflow-hidden max-[600px]:h-[220px]">
                    <Image
                      src={assetPath(image)}
                      alt={product.model}
                      fill
                      sizes="(max-width: 900px) 100vw, 50vw"
                      unoptimized
                      className="object-contain object-center transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[7px] group-hover:scale-[1.015]"
                    />
                  </div>

                  <div className="text-micro text-on-dark/65 absolute right-[25px] bottom-5 left-[25px] z-20 flex items-center justify-between font-extrabold tracking-[0.12em]">
                    <span>{product.category}</span>
                    <span>0{index + 1} / 02</span>
                  </div>
                </div>

                <div className="p-[29px] pt-[29px] pb-[25px] max-[900px]:px-5 max-[900px]:py-[23px] max-[650px]:px-[23px] max-[650px]:py-[25px]">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <span className="text-micro text-brand font-black tracking-[0.16em]">
                        ГОТОВЫЙ КОМПЛЕКТ
                      </span>

                      <h3 className="mt-2 text-[29px] font-black tracking-[-0.055em]">
                        {product.model}
                      </h3>
                    </div>

                    <span className="text-foreground/10 text-4xl leading-none font-black">
                      0{index + 1}
                    </span>
                  </div>

                  <p className="text-muted-foreground mt-[17px] mb-5 max-w-[420px] text-xs leading-[1.85]">
                    {product.description}
                  </p>

                  <ul className="m-0 flex list-none flex-col gap-[11px] border-t px-0 pt-[19px] pb-[22px]">
                    {product.features.map((feature) => (
                      <li
                        key={feature}
                        className="text-caption text-foreground flex items-center gap-[11px] font-bold"
                      >
                        <span aria-hidden="true" className="text-brand text-sm font-black">
                          ✓
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#contacts"
                    className="group/action text-brand flex items-center justify-between gap-[15px] border-t pt-[19px] text-xs font-black"
                  >
                    <span>Запросить комплект</span>

                    <span
                      aria-hidden="true"
                      className="text-[19px] transition-transform duration-[220ms] ease-[ease] group-hover/action:translate-x-1 group-hover/action:-translate-y-1"
                    >
                      ↗
                    </span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>

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
                <span className="text-micro text-brand font-black">0{index + 1}</span>

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
      </div>
    </section>
  );
}
