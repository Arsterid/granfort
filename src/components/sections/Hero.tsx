import { assetPath } from "@/lib/assetPath";
import Image from "next/image";

export default function Hero() {
  return (
    <section id="top" className="overflow-hidden pt-16 pb-8 max-[560px]:pt-[35px]">
      <div className="max-w-site mx-auto w-[calc(100%_-_64px)] max-[560px]:w-[calc(100%_-_36px)]">
        <div className="grid grid-cols-[0.92fr_1.08fr] items-center gap-[46px] max-[1050px]:gap-7 max-[900px]:grid-cols-1">
          <div className="py-6 pb-[30px] max-[900px]:pb-0">
            <div className="text-micro text-brand flex items-center gap-3 font-extrabold tracking-[0.15em] uppercase">
              <span className="bg-brand h-0.5 w-8" />
              Инженерия для бездорожья
            </div>

            <h1 className="text-hero max-[560px]:text-hero-mobile mt-[26px] mb-[22px] max-w-[650px] font-black tracking-[-0.065em] max-[900px]:max-w-[700px] max-[560px]:mt-5">
              Защита, которая <span className="text-brand">готова к бездорожью.</span>
            </h1>

            <p className="text-muted-foreground max-w-[490px] text-[15px] leading-[1.85] max-[560px]:text-[13px]">
              Производим защиту передних и задних бамперов для современных внедорожников и пикапов.
              Надёжные материалы, точная геометрия и продуманное крепление без сверления кузова.
            </p>

            <div className="mt-[34px] flex flex-wrap gap-3 max-[560px]:flex-col">
              <a
                href="#products"
                className="rounded-control bg-primary text-primary-foreground hover:bg-brand-dark inline-flex min-h-[54px] items-center justify-center gap-[18px] border border-transparent px-6 text-[13px] font-extrabold transition-[background-color,color,border-color,transform] duration-[220ms] ease-[ease] hover:-translate-y-0.5 max-[560px]:w-full"
              >
                Смотреть комплекты
                <span aria-hidden="true" className="text-lg leading-none">
                  ↗
                </span>
              </a>

              <a
                href="#custom"
                className="rounded-control text-foreground hover:border-brand hover:text-brand inline-flex min-h-[54px] items-center justify-center gap-[18px] border bg-transparent px-6 text-[13px] font-extrabold transition-[background-color,color,border-color,transform] duration-[220ms] ease-[ease] hover:-translate-y-0.5 max-[560px]:w-full"
              >
                Индивидуальное изготовление
              </a>
            </div>

            <div className="mt-[55px] grid max-w-[540px] grid-cols-3 gap-[15px] border-t pt-[23px] max-[560px]:mt-[34px] max-[560px]:gap-2">
              <div className="flex flex-col gap-1">
                <strong className="text-foreground text-sm font-black max-[560px]:text-xs">
                  AISI 304
                </strong>
                <span className="text-muted-foreground text-[10px] leading-[1.5] max-[560px]:text-[9px]">
                  Нержавеющая сталь
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <strong className="text-foreground text-sm font-black max-[560px]:text-xs">
                  Без сверления
                </strong>
                <span className="text-muted-foreground text-[10px] leading-[1.5] max-[560px]:text-[9px]">
                  Штатные точки крепления
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <strong className="text-foreground text-sm font-black max-[560px]:text-xs">
                  По всей России
                </strong>
                <span className="text-muted-foreground text-[10px] leading-[1.5] max-[560px]:text-[9px]">
                  Доставка продукции
                </span>
              </div>
            </div>
          </div>

          <div
            role="img"
            aria-label="Иллюстрация внедорожника в индустриальном стиле"
            className="rounded-control text-on-dark relative isolate min-h-[550px] overflow-hidden bg-[image:var(--hero-visual-background)] max-[1050px]:min-h-[490px] max-[900px]:min-h-[480px] max-[560px]:min-h-[340px]"
          >
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[image:var(--visual-grid-background)] bg-size-[48px_48px]" />

            <div className="border-on-dark/[0.08] pointer-events-none absolute -right-[110px] -bottom-[190px] -z-10 size-[460px] rounded-full border shadow-[var(--hero-visual-orbit-shadow)]" />

            <div className="text-micro text-on-dark/65 absolute top-[26px] right-[30px] left-[30px] z-10 flex justify-between font-extrabold tracking-[0.18em] max-[560px]:top-5 max-[560px]:right-[18px] max-[560px]:left-[18px] max-[560px]:text-[8px]">
              <span>GRANFORT / AUTOMOTIVE</span>
              <span>GF — 001</span>
            </div>

            <div className="border-on-dark/20 bg-on-dark/5 text-micro text-on-dark/85 absolute top-[85px] left-[30px] z-10 border px-3 py-[9px] font-extrabold tracking-[0.12em] max-[560px]:top-[63px] max-[560px]:left-[18px]">
              OFF-ROAD SERIES
            </div>

            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <span className="text-on-dark/[0.055] absolute top-[145px] left-[30px] text-[clamp(90px,13vw,170px)] leading-none font-black tracking-[-0.1em] max-[560px]:top-[100px] max-[560px]:left-[18px]">
                4×4
              </span>

              <Image
                src={assetPath("/images/vehicles-lineup.png")}
                alt=""
                width={1200}
                height={800}
                sizes="(max-width: 900px) 100vw, 50vw"
                unoptimized
                priority
                className="h-auto max-h-[330px] w-full max-w-[850px] object-contain max-[560px]:max-h-[260px]"
              />
            </div>

            <div className="border-on-dark/[0.18] absolute right-[30px] bottom-7 left-[30px] z-10 flex items-end justify-between border-t pt-5 max-[560px]:right-[18px] max-[560px]:bottom-[18px] max-[560px]:left-[18px]">
              <div className="flex flex-col gap-[5px]">
                <span className="text-micro text-on-dark/55 font-bold tracking-[0.15em]">
                  ENGINEERED FOR ADVENTURE
                </span>

                <strong className="text-compact font-extrabold max-[560px]:max-w-[220px] max-[560px]:text-[11px]">
                  Защита переднего и заднего бампера
                </strong>
              </div>

              <span className="text-on-dark/30 text-[35px] leading-none font-black max-[560px]:text-[27px]">
                01
              </span>
            </div>
          </div>
        </div>

        <div className="text-caption text-muted-foreground mt-7 flex justify-between gap-5 font-bold max-[560px]:flex-col max-[560px]:gap-2 max-[560px]:text-[10px]">
          <span>Специализация на китайских внедорожниках и пикапах</span>

          <span className="inline-flex items-center gap-[9px]">
            <i aria-hidden="true" className="bg-brand size-[7px] rounded-full" />
            Доставка по всей России
          </span>
        </div>
      </div>
    </section>
  );
}
