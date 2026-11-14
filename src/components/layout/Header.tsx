"use client";

import { assetPath } from "@/lib/assetPath";
import Image from "next/image";

const navigation = [
  { label: "О компании", href: "#about" },
  { label: "Комплекты", href: "#products" },
  { label: "Преимущества", href: "#advantages" },
  { label: "Изготовление", href: "#custom" },
  { label: "Контакты", href: "#contacts" },
];

export default function Header() {
  return (
    <header className="h-header border-header-border bg-header max-md:h-header-compact sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="max-w-site max-xs:px-4 mx-auto flex h-full w-full items-center justify-between px-8">
        <a
          href="#top"
          className="inline-flex shrink-0 items-center"
          aria-label="GRANFORT — на главную"
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
          className="flex items-center gap-8 max-lg:gap-4 max-md:hidden"
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
          className="rounded-control border-brand bg-brand text-primary-foreground hover:border-brand-dark hover:bg-brand-dark inline-flex min-h-11 items-center justify-center gap-4 border px-5 text-xs font-extrabold transition-colors duration-200 max-sm:px-3.5"
        >
          Обсудить проект
          <span className="text-lg leading-none" aria-hidden="true">
            ↗
          </span>
        </a>
      </div>
    </header>
  );
}
