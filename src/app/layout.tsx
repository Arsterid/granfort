import type { Metadata } from "next";
import { Manrope, Geist } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GRANFORT - защита для внедорожников и пикапов",
  description:
    "Производство защиты передних и задних бамперов для китайских внедорожников и пикапов. Нержавеющая сталь AISI 304, порошковое покрытие, индивидуальное изготовление.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ru" className={cn("h-full", "antialiased", manrope.variable, "font-sans", geist.variable)}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
