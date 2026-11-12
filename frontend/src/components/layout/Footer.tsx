import { assetPath } from "@/lib/assetPath";
import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__main">
          <div className="site-footer__brand">
            <a href="#" className="site-footer__logo">
              <Image
                src={assetPath("/granfort-logo.svg")}
                alt="GRANFORT"
                width={691}
                height={277}
                unoptimized
                className="site-footer__logo-image"
              />
            </a>

            <p>
              Защита бамперов для внедорожников и пикапов. Надёжные решения для дорог и бездорожья.
            </p>
          </div>

          <nav className="site-footer__nav" aria-label="Навигация в подвале">
            <a href="#about">О компании</a>
            <a href="#products">Продукция</a>
            <a href="#advantages">Преимущества</a>
            <a href="#custom">Индивидуальное изготовление</a>
            <a href="#contacts">Контакты</a>
          </nav>
        </div>

        <div className="site-footer__bottom">
          <p>© {year} GRANFORT. Все права защищены.</p>
          <a href="#">Наверх ↑</a>
        </div>
      </div>
    </footer>
  );
}
