import { assetPath } from "@/lib/assetPath";
import Image from "next/image";

export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="bg-card py-[110px] pb-[120px] max-[900px]:py-[85px]"
    >
      <div className="max-w-site mx-auto grid w-[calc(100%_-_4rem)] grid-cols-2 items-center gap-[clamp(45px,7vw,100px)] max-[1000px]:gap-[35px] max-[900px]:grid-cols-1 max-[900px]:gap-[50px]">
        <div className="rounded-control text-on-dark relative isolate flex min-h-[520px] flex-col justify-between overflow-hidden bg-[image:var(--visual-panel-background)] px-[30px] py-[27px] before:absolute before:inset-0 before:z-0 before:bg-[image:var(--visual-grid-background)] before:[background-size:38px_38px] before:content-[''] max-[1000px]:min-h-[460px] max-[900px]:min-h-[490px]">
          <div className="text-micro text-on-dark-muted/95 relative z-10 flex items-center justify-between font-extrabold tracking-[0.15em]">
            <span>GRANFORT / PRODUCTION</span>
            <span>01 — 02</span>
          </div>

          <div className="relative z-10 flex min-h-[320px] flex-1 items-center justify-center max-[1000px]:min-h-[260px]">
            <span className="text-on-dark/[0.045] pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[clamp(75px,10vw,130px)] leading-none font-black tracking-[-0.09em] whitespace-nowrap max-[900px]:text-[140px]">
              STEEL
            </span>

            <div className="relative aspect-[680/420] w-full overflow-hidden">
              <Image
                src={assetPath("/images/jac-tuned.png")}
                alt="Тюнингованный JAC T9"
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                unoptimized
                className="object-contain object-center"
                loading="eager"
              />
            </div>
          </div>

          <div className="border-on-dark/20 relative z-10 flex items-center justify-between border-t pt-5">
            <div className="flex flex-col gap-1">
              <span className="text-micro text-on-dark-muted/85 font-extrabold tracking-[0.15em]">
                OUR APPROACH
              </span>

              <strong className="text-compact font-extrabold">Надёжность в каждой детали</strong>
            </div>

            <div className="text-display-index font-black tracking-[-0.06em]">
              GF<span className="text-brand-accent mx-1">/</span>01
            </div>
          </div>
        </div>

        <div className="max-[900px]:max-w-[650px]">
          <div className="text-micro text-brand flex items-center gap-3 font-extrabold tracking-[0.15em] uppercase">
            <span className="bg-brand h-0.5 w-8" />О компании
          </div>

          <h2
            id="about-title"
            className="text-section-title mt-6 mb-[22px] font-black tracking-[-0.055em]"
          >
            Создаём защиту для тех, кто <span className="text-brand">выбирает больше.</span>
          </h2>

          <p className="text-foreground text-background mb-[15px] leading-[1.8] font-bold">
            Мы занимаемся разработкой и производством элементов автомобильного тюнинга, уделяя
            особое внимание внедорожникам и пикапам китайских марок.
          </p>

          <p className="text-compact text-muted-foreground leading-[1.95]">
            Наша специализация — защита передних и задних бамперов. Мы стремимся создавать не просто
            дополнительные элементы экстерьера, а функциональные решения, которые сочетают
            практичность, качество материалов и аккуратный внешний вид.
          </p>

          <div className="mt-8 flex flex-col border-t">
            <div className="flex items-start gap-5 border-b py-5">
              <span className="text-caption text-brand shrink-0 pt-0.5 font-black tracking-[0.1em]">
                01
              </span>

              <div className="flex flex-col gap-1">
                <strong className="text-compact font-black">Нержавеющая сталь AISI 304</strong>

                <span className="text-caption text-muted-foreground leading-[1.7]">
                  Зеркальная полировка и выразительный металлический блеск.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-5 border-b py-5">
              <span className="text-caption text-brand shrink-0 pt-0.5 font-black tracking-[0.1em]">
                02
              </span>

              <div className="flex flex-col gap-1">
                <strong className="text-compact font-black">Чёрный металл</strong>

                <span className="text-caption text-muted-foreground leading-[1.7]">
                  Практичное порошковое покрытие с лаконичным внешним видом.
                </span>
              </div>
            </div>
          </div>

          <a
            href="#products"
            className="group text-brand mt-7 inline-flex items-center gap-4.5 text-xs font-black"
          >
            Познакомиться с продукцией
            <span
              aria-hidden="true"
              className="text-xl transition-transform duration-[220ms] ease-[ease] group-hover:translate-x-1 group-hover:-translate-y-1"
            >
              ↗
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
