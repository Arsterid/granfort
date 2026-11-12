import { assetPath } from "@/lib/assetPath";
import Image from "next/image";
export default function About() {
  return (
    <section className="about" id="about" aria-labelledby="about-title">
      <div className="about__layout container">
        <div className="about__visual">
          <div className="about__visual-top">
            <span>GRANFORT / PRODUCTION</span>
            <span>01 — 02</span>
          </div>

          <div className="about__illustration">
            <span className="about__visual-bg-text">STEEL</span>

            <div className="about__photo-stage">
              <Image
                src={assetPath("/images/jac-tuned.png")}
                alt="Тюнингованный JAC T9"
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                unoptimized
                className="about__photo"
                loading="eager"
              />
            </div>
          </div>

          <div className="about__visual-bottom">
            <div>
              <span>OUR APPROACH</span>
              <strong>Надёжность в каждой детали</strong>
            </div>

            <div className="about__visual-index">
              GF<span>/</span>01
            </div>
          </div>
        </div>

        <div className="about__content">
          <div className="eyebrow">
            <span className="eyebrow__line" />О компании
          </div>

          <h2 id="about-title">
            Создаём защиту для тех, кто <span>выбирает больше.</span>
          </h2>

          <p className="about__lead">
            Мы занимаемся разработкой и производством элементов автомобильного тюнинга, уделяя
            особое внимание внедорожникам и пикапам китайских марок.
          </p>

          <p className="about__description">
            Наша специализация — защита передних и задних бамперов. Мы стремимся создавать не просто
            дополнительные элементы экстерьера, а функциональные решения, которые сочетают
            практичность, качество материалов и аккуратный внешний вид.
          </p>

          <div className="about__materials">
            <div className="about__material">
              <span className="about__material-number">01</span>
              <div>
                <strong>Нержавеющая сталь AISI 304</strong>
                <span>Зеркальная полировка и выразительный металлический блеск.</span>
              </div>
            </div>

            <div className="about__material">
              <span className="about__material-number">02</span>
              <div>
                <strong>Чёрный металл</strong>
                <span>Практичное порошковое покрытие с лаконичным внешним видом.</span>
              </div>
            </div>
          </div>

          <a href="#products" className="about__link">
            Познакомиться с продукцией
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
