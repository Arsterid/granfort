import { assetPath } from "@/lib/assetPath";
import Image from "next/image";

export default function Custom() {
  return (
    <section
      id="custom"
      aria-labelledby="custom-title"
      className="bg-background text-foreground py-[110px] max-[900px]:py-[85px] max-[600px]:py-[70px]"
    >
      <div className="max-w-site mx-auto w-[calc(100%_-_64px)] max-[560px]:w-[calc(100%_-_36px)]">
        <div className="grid grid-cols-[1fr_0.9fr] items-center gap-[70px] max-[900px]:grid-cols-1 max-[900px]:gap-11">
          <div>
            <p className="text-caption text-brand font-extrabold tracking-[0.15em] uppercase">
              Индивидуальное изготовление
            </p>

            <h2
              id="custom-title"
              className="mt-[18px] mb-[22px] max-w-[560px] text-[clamp(34px,4vw,52px)] leading-[1.08] font-bold tracking-[-0.04em] max-[600px]:text-4xl"
            >
              Нужна защита для другой модели?
            </h2>

            <p className="text-muted-foreground text-background max-w-[520px] leading-[1.75]">
              Разработаем комплект под ваш автомобиль и задачи. Обсудим конструкцию, материал и
              исполнение, чтобы защита гармонично сочеталась с автомобилем.
            </p>

            <div className="my-[34px] grid gap-[18px]">
              <div className="flex items-center gap-4">
                <span className="text-brand-accent shrink-0 text-xs font-bold tracking-[0.08em]">
                  01
                </span>
                <p className="m-0 text-[15px] leading-[1.5]">
                  Разработка для других марок и моделей
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-brand-accent shrink-0 text-xs font-bold tracking-[0.08em]">
                  02
                </span>
                <p className="m-0 text-[15px] leading-[1.5]">
                  Нержавеющая сталь AISI 304 или чёрный металл
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-brand-accent shrink-0 text-xs font-bold tracking-[0.08em]">
                  03
                </span>
                <p className="m-0 text-[15px] leading-[1.5]">Выбор исполнения под ваши пожелания</p>
              </div>
            </div>

            <a
              href="#contacts"
              className="border-brand-accent bg-brand-accent text-primary-foreground hover:border-brand-dark hover:bg-brand-dark inline-flex min-h-[54px] items-center justify-center gap-[30px] border px-6 text-sm font-semibold transition-colors duration-250"
            >
              Обсудить проект
              <span aria-hidden="true" className="text-xl leading-none">
                →
              </span>
            </a>
          </div>

          <div className="bg-night-elevated text-on-dark/90 relative flex min-h-[390px] flex-col justify-between overflow-hidden bg-[image:var(--visual-grid-background)] bg-size-[36px_36px] p-[26px] max-[900px]:min-h-[360px] max-[600px]:min-h-[300px] max-[600px]:p-5">
            <div
              aria-hidden="true"
              className="border-on-dark/[0.07] pointer-events-none absolute top-1/2 left-1/2 size-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border"
            />

            <div className="text-micro text-on-dark-muted relative z-10 flex justify-between gap-4 font-semibold tracking-[0.14em]">
              <span>GRANFORT / CUSTOM</span>
              <span className="text-brand-highlight">GF — 03</span>
            </div>

            <Image
              src={assetPath("/images/tuning-parts.png")}
              alt="Части тюнинга"
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              unoptimized
              className="object-contain object-center"
              loading="eager"
            />

            <div className="relative z-10 flex flex-col gap-2">
              <span className="text-micro text-brand-highlight font-bold tracking-[0.14em]">
                ИНДИВИДУАЛЬНЫЙ ПРОЕКТ
              </span>
              <strong className="text-[19px] font-medium max-[600px]:text-[17px]">
                От идеи — к готовому комплекту
              </strong>
            </div>
          </div>
        </div>

        <div className="mt-[76px] grid grid-cols-3 gap-[30px] border-t pt-8 max-[900px]:mt-[55px] max-[900px]:gap-[22px] max-[600px]:mt-11 max-[600px]:grid-cols-1 max-[600px]:gap-[25px] max-[600px]:pt-[26px]">
          <div className="flex items-start gap-[18px]">
            <span className="text-brand-accent text-[13px] font-bold">01</span>
            <div>
              <h3 className="text-background mb-[9px] font-semibold">Обсуждаем задачу</h3>
              <p className="text-muted-foreground m-0 max-w-[260px] text-[13px] leading-[1.6]">
                Уточняем модель автомобиля и ваши пожелания
              </p>
            </div>
          </div>

          <div className="flex items-start gap-[18px]">
            <span className="text-brand-accent text-[13px] font-bold">02</span>
            <div>
              <h3 className="text-background mb-[9px] font-semibold">Согласуем решение</h3>
              <p className="text-muted-foreground m-0 max-w-[260px] text-[13px] leading-[1.6]">
                Подбираем материал, конструкцию и исполнение
              </p>
            </div>
          </div>

          <div className="flex items-start gap-[18px]">
            <span className="text-brand-accent text-[13px] font-bold">03</span>
            <div>
              <h3 className="text-background mb-[9px] font-semibold">Изготавливаем комплект</h3>
              <p className="text-muted-foreground m-0 max-w-[260px] text-[13px] leading-[1.6]">
                Переходим к реализации согласованного проекта
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
