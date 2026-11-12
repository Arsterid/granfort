import { assetPath } from "@/lib/assetPath";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container">
        <div className="hero__layout">
          <div className="hero__content">
            <div className="eyebrow">
              <span className="eyebrow__line" />
              Инженерия для бездорожья
            </div>

            <h1>
              Защита, которая <span>готова к бездорожью.</span>
            </h1>

            <p className="hero__description">
              Производим защиту передних и задних бамперов для современных внедорожников и пикапов.
              Надёжные материалы, точная геометрия и продуманное крепление без сверления кузова.
            </p>

            <div className="hero__actions">
              <a href="#products" className="button button--primary">
                Смотреть комплекты
                <span className="button__arrow" aria-hidden="true">
                  ↗
                </span>
              </a>

              <a href="#custom" className="button button--outline">
                Индивидуальное изготовление
              </a>
            </div>

            <div className="hero__facts">
              <div className="hero__fact">
                <strong>AISI 304</strong>
                <span>Нержавеющая сталь</span>
              </div>

              <div className="hero__fact">
                <strong>Без сверления</strong>
                <span>Штатные точки крепления</span>
              </div>

              <div className="hero__fact">
                <strong>По всей России</strong>
                <span>Доставка продукции</span>
              </div>
            </div>
          </div>

          <div
            className="hero__visual"
            role="img"
            aria-label="Иллюстрация внедорожника в индустриальном стиле"
          >
            <div className="hero__visual-top">
              <span>GRANFORT / AUTOMOTIVE</span>
              <span>GF — 001</span>
            </div>

            <div className="hero__visual-chip">OFF-ROAD SERIES</div>

            <div className="hero__visual-center">
              <span className="hero__visual-4x4">4×4</span>

              <Image
                src={assetPath("/images/vehicles-lineup.png")}
                alt=""
                width={1200}
                height={800}
                sizes="(max-width: 900px) 100vw, 50vw"
                unoptimized
                priority
                className="hero__vehicles"
              />
            </div>

            <div className="hero__visual-footer">
              <div>
                <span>ENGINEERED FOR ADVENTURE</span>
                <strong>Защита переднего и заднего бампера</strong>
              </div>

              <span className="hero__visual-number">01</span>
            </div>
          </div>
        </div>

        <div className="hero__bottomline">
          <span>Специализация на китайских внедорожниках и пикапах</span>

          <span>
            <i aria-hidden="true" />
            Доставка по всей России
          </span>
        </div>
      </div>
    </section>
  );
}
