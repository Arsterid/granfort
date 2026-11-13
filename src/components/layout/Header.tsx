"use client";

import { assetPath } from "@/lib/assetPath";
import Image from "next/image";
import { useState } from "react";

const navigation = [
  { label: "О компании", href: "#about" },
  { label: "Комплекты", href: "#products" },
  { label: "Преимущества", href: "#advantages" },
  { label: "Изготовление", href: "#custom" },
  { label: "Контакты", href: "#contacts" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="h-header border-header-border bg-header max-md:h-header-compact sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="max-w-site max-xs:px-4 mx-auto flex h-full w-full items-center justify-between px-8">
        <a
          href="#top"
          className="inline-flex shrink-0 items-center"
          aria-label="GRANFORT — на главную"
          onClick={closeMenu}
        >
          <Image
            src={assetPath("/granfort-logo.svg")}
            alt="GRANFORT"
            width={691}
            height={277}
            unoptimized
            loading="eager"
            className="w-logo max-sm:w-logo-compact h-auto"
          />
        </a>

        <nav
          className="hidden items-center gap-8 max-lg:gap-4 max-md:flex"
          aria-label="Основная навигация"
        >
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-header-link after:bg-brand-accent hover:text-header-foreground max-lg:text-nav-compact relative text-xs font-bold transition-colors duration-200 after:absolute after:inset-x-0 after:-bottom-2 after:h-0.5 after:origin-left after:scale-x-0 after:transition-transform after:duration-200 after:content-[''] hover:after:scale-x-100"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#contacts"
          className="rounded-control border-brand bg-brand text-primary-foreground hover:border-brand-dark hover:bg-brand-dark inline-flex min-h-11 items-center justify-center gap-4 border px-5 text-xs font-extrabold transition-colors duration-200 max-md:hidden"
        >
          Обсудить проект
          <span className="text-lg leading-none" aria-hidden="true">
            ↗
          </span>
        </a>

        <button
          type="button"
          className="rounded-control border-header-control-border hover:border-header-control-hover-border hidden h-11 w-11 flex-col items-center justify-center gap-1.5 border bg-transparent p-2.5 transition-colors duration-200 max-md:flex"
          aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span className="bg-header-icon h-0.5 w-full" aria-hidden="true" />
          <span className="bg-header-icon h-0.5 w-full" aria-hidden="true" />
        </button>
      </div>

      <nav
        id="mobile-navigation"
        className={`${isMenuOpen ? "flex" : "hidden"} border-header-border bg-header-menu absolute top-full right-0 left-0 z-10 flex-col border-b px-8 pt-3 pb-6 shadow-lg max-md:hidden`}
        aria-label="Мобильная навигация"
      >
        {navigation.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={closeMenu}
            className="border-header-border text-header-link-xs hover:text-header-foreground border-b py-3 text-sm font-bold transition-colors duration-200"
          >
            {item.label}
          </a>
        ))}

        <a
          href="#contacts"
          onClick={closeMenu}
          className="rounded-control border-brand bg-brand text-primary-foreground hover:border-brand-dark hover:bg-brand-dark mt-4 self-start border px-4 py-3 text-sm font-bold transition-colors duration-200"
        >
          Оставить заявку
        </a>
      </nav>
    </header>
  );
}
