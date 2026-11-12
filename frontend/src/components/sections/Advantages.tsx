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
];

function AdvantageIcon({ type }: { type: string }) {
  const common = {
    width: 34,
    height: 34,
    viewBox: "0 0 40 40",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
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
    <section className="advantages" id="advantages" aria-labelledby="advantages-title">
      <div className="container">
        <div className="advantages__heading">
          <div>
            <div className="eyebrow eyebrow--light">
              <span className="eyebrow__line" />
              Почему GRANFORT
            </div>

            <h2 id="advantages-title">
              Продумано до <span>мельчайших деталей.</span>
            </h2>
          </div>

          <p>
            Мы уделяем внимание не только внешнему виду, но и практичности каждого решения. От
            выбора материала до удобства установки.
          </p>
        </div>

        <div className="advantages__grid">
          {advantages.map((advantage) => (
            <article className="advantage-card" key={advantage.number}>
              <div className="advantage-card__top">
                <div className="advantage-card__icon">
                  <AdvantageIcon type={advantage.icon} />
                </div>

                <span className="advantage-card__number">{advantage.number}</span>
              </div>

              <h3>{advantage.title}</h3>

              <p>{advantage.description}</p>

              <span className="advantage-card__line" />
            </article>
          ))}
        </div>

        <div className="advantages__footer">
          <span>GRANFORT / ENGINEERED FOR ADVENTURE</span>
          <span>Надёжность начинается с деталей.</span>
        </div>
      </div>
    </section>
  );
}
