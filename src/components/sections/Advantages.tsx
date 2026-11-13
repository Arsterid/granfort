const advantages = [
  {
    number: "01",
    title: "Качественные материалы",
    description: "Используем нержавеющую сталь AISI 304 и чёрный металл с порошковым покрытием.",
    icon: "materials",
  },
  {
    number: "02",
    title: "Без сверления кузова",
    description:
      "Конструкция предусматривает установку без сверления и доработки кузова автомобиля.",
    icon: "installation",
  },
  {
    number: "03",
    title: "Установка под ключ",
    description: "Можно приобрести комплект отдельно или заказать готовое решение с установкой.",
    icon: "tools",
  },
  {
    number: "04",
    title: "Индивидуальный подход",
    description: "Рассматриваем запросы на разработку и изготовление защиты для других моделей.",
    icon: "custom",
  },
  {
    number: "05",
    title: "Доставка по России",
    description: "Организуем отправку продукции клиентам в разные регионы страны.",
    icon: "delivery",
  },
  {
    number: "06",
    title: "Фокус на китайских авто",
    description: "Специализируемся на внедорожниках и пикапах китайских производителей.",
    icon: "vehicle",
  },
] as const;

type AdvantageIconType = (typeof advantages)[number]["icon"];

function AdvantageIcon({ type }: { type: AdvantageIconType }) {
  const common = {
    viewBox: "0 0 40 40",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
    className: "size-[34px]",
  };

  switch (type) {
    case "materials":
      return (
        <svg {...common}>
          <path d="M20 4 34 12V28L20 36 6 28V12L20 4Z" />
          <path d="m6 12 14 8 14-8M20 20v16M13 8l14 8" />
        </svg>
      );

    case "installation":
      return (
        <svg {...common}>
          <path d="M20 4 33 9V19C33 27 27 33 20 36 13 33 7 27 7 19V9L20 4Z" />
          <path d="m14 20 4 4 8-9" />
        </svg>
      );

    case "tools":
      return (
        <svg {...common}>
          <path d="m24 8 8 8M27 5l8 8-5 5-8-8" />
          <path d="m23 17-15 15a3 3 0 0 1-4-4l15-15" />
          <path d="m10 9 5-5 8 8-5 5" />
        </svg>
      );

    case "custom":
      return (
        <svg {...common}>
          <path d="M8 32 30 10l4 4-22 22H8v-4Z" />
          <path d="m25 15 4 4M8 8h10M8 8v10M32 32H22M32 32V22" />
        </svg>
      );

    case "delivery":
      return (
        <svg {...common}>
          <path d="M4 11h20v18H4zM24 17h7l5 6v6H24z" />
          <circle cx="12" cy="31" r="3" />
          <circle cx="30" cy="31" r="3" />
          <path d="M29 17v7h7" />
        </svg>
      );

    default:
      return (
        <svg {...common}>
          <path d="M5 25V16l4-8h22l4 8v9" />
          <path d="M5 25h30v6H5zM9 16h22M13 8l-3 8M27 8l3 8" />
          <circle cx="12" cy="29" r="3" />
          <circle cx="28" cy="29" r="3" />
        </svg>
      );
  }
}

export default function Advantages() {
  return (
    <section
      id="advantages"
      aria-labelledby="advantages-title"
      className="bg-night text-on-dark relative isolate overflow-hidden py-[110px] pb-[45px] max-[900px]:pt-[85px] max-[650px]:py-[70px] max-[650px]:pb-[30px]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[220px] -right-[180px] size-[600px] rounded-full bg-[image:var(--advantages-glow)]"
      />

      <div className="max-w-site relative z-10 mx-auto w-[calc(100%_-_4rem)]">
        <div className="mb-[55px] grid grid-cols-[1fr_0.65fr] items-end gap-[50px] max-[900px]:mb-[55px] max-[900px]:grid-cols-1 max-[900px]:gap-[18px] max-[650px]:mb-[35px]">
          <div>
            <div className="text-micro text-on-dark/60 flex items-center gap-3 font-extrabold tracking-[0.15em] uppercase">
              <span className="bg-brand h-0.5 w-8" />
              Почему GRANFORT
            </div>

            <h2
              id="advantages-title"
              className="text-section-title-lg mt-[23px] max-w-[650px] font-black tracking-[-0.06em] max-[650px]:text-[clamp(34px,9vw,44px)]"
            >
              Продумано до <span className="text-brand-soft">мельчайших деталей.</span>
            </h2>
          </div>

          <p className="text-compact text-on-dark-muted mb-[5px] ml-auto max-w-[410px] leading-[1.9] max-[900px]:m-0">
            Мы уделяем внимание не только внешнему виду, но и практичности каждого решения. От
            выбора материала до удобства установки.
          </p>
        </div>

        <div className="border-on-dark/[0.14] relative grid grid-cols-3 border-t border-l max-[900px]:grid-cols-2 max-[650px]:grid-cols-1">
          {advantages.map((advantage) => (
            <article
              key={advantage.number}
              className="group border-on-dark/[0.14] hover:bg-on-dark/[0.045] relative flex min-h-[235px] flex-col border-r border-b p-7 pb-[30px] transition-colors duration-300 max-[650px]:min-h-[190px] max-[650px]:p-[23px]"
            >
              <div className="mb-7 flex items-center justify-between max-[650px]:mb-5">
                <div className="border-brand-soft/35 text-brand-soft group-hover:border-brand-accent group-hover:bg-brand-accent flex size-13 items-center justify-center rounded-sm border transition-colors duration-300 group-hover:text-white">
                  <AdvantageIcon type={advantage.icon} />
                </div>

                <span className="text-on-dark/25 text-xs font-extrabold tracking-[0.1em]">
                  {advantage.number}
                </span>
              </div>

              <h3 className="text-background mb-3 font-black tracking-[-0.025em]">
                {advantage.title}
              </h3>

              <p className="text-caption text-on-dark/[0.55] max-w-[310px] leading-[1.9]">
                {advantage.description}
              </p>

              <span className="from-brand-accent mt-auto h-0.5 w-0 bg-gradient-to-r to-transparent transition-[width] duration-300 group-hover:w-full" />
            </article>
          ))}
        </div>

        <div className="text-micro text-on-dark/35 flex items-center justify-between gap-5 pt-[25px] font-extrabold tracking-[0.13em] max-[650px]:flex-col max-[650px]:items-start max-[650px]:gap-2.5 max-[650px]:text-[8px]">
          <span>GRANFORT / ENGINEERED FOR ADVENTURE</span>
          <span>Надёжность начинается с деталей.</span>
        </div>
      </div>
    </section>
  );
}
