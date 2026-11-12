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
    <header className="site-header">
      <div className="header__inner container">
        <a href="#top" className="brand" aria-label="GRANFORT — на главную" onClick={closeMenu}>
          <Image
            src={assetPath("/granfort-logo.svg")}
            alt="GRANFORT"
            width={691}
            height={277}
            unoptimized
            className="header__logo-image"
            loading="eager"
          />
        </a>

        <nav className="header__nav" aria-label="Основная навигация">
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <a href="#contacts" className="button button--primary header__action">
          Обсудить проект
          <span className="button__arrow" aria-hidden="true">
            ↗
          </span>
        </a>

        <button
          type="button"
          className="header__menu-toggle"
          aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span />
          <span />
        </button>
      </div>

      <nav
        id="mobile-navigation"
        className={`mobile-nav ${isMenuOpen ? "mobile-nav--open" : ""}`}
        aria-label="Мобильная навигация"
      >
        {navigation.map((item) => (
          <a key={item.href} href={item.href} onClick={closeMenu}>
            {item.label}
          </a>
        ))}

        <a href="#contacts" onClick={closeMenu}>
          Оставить заявку
        </a>
      </nav>
    </header>
  );
}
