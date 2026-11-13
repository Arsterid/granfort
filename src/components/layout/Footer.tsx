import { assetPath } from "@/lib/assetPath";
import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-night-deep text-on-dark">
      <div className="max-w-site max-xs:px-4 mx-auto w-full px-8">
        <div className="border-on-dark/10 flex flex-col gap-10 border-b py-12 md:flex-row md:items-start md:justify-between md:gap-16 md:py-16">
          <div className="max-w-sm">
            <a href="#top" className="inline-flex items-center" aria-label="GRANFORT — наверх">
              <Image
                src={assetPath("/granfort-logo.svg")}
                alt="GRANFORT"
                width={691}
                height={277}
                unoptimized
                className="w-logo-compact h-auto"
              />
            </a>

            <p className="text-on-dark-muted mt-5 text-sm leading-relaxed">
              Защита бамперов для внедорожников и пикапов. Надёжные решения для дорог и бездорожья.
            </p>
          </div>

          <nav
            className="text-on-dark-muted flex flex-col items-start gap-3 text-sm font-semibold"
            aria-label="Навигация в подвале"
          >
            <a href="#about" className="hover:text-on-dark transition-colors duration-200">
              О компании
            </a>
            <a href="#products" className="hover:text-on-dark transition-colors duration-200">
              Продукция
            </a>
            <a href="#advantages" className="hover:text-on-dark transition-colors duration-200">
              Преимущества
            </a>
            <a href="#custom" className="hover:text-on-dark transition-colors duration-200">
              Индивидуальное изготовление
            </a>
            <a href="#contacts" className="hover:text-on-dark transition-colors duration-200">
              Контакты
            </a>
          </nav>
        </div>

        <div className="text-on-dark-muted xs:flex-row xs:items-center xs:justify-between flex flex-col gap-4 py-6 text-xs">
          <p>© {year} GRANFORT. Все права защищены.</p>
          <a href="#top" className="hover:text-on-dark transition-colors duration-200">
            Наверх ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
