"use client";

import { useEffect, useState } from "react";
import { translations } from "../lib/i18n";
import { BASE_PATH } from "../lib/paths";

export default function Home() {
  const [language, setLanguage] = useState("ru");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("aladent_language");

    if (savedLanguage === "ru" || savedLanguage === "kz") {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    localStorage.setItem("aladent_language", nextLanguage);
  };

  const t = translations[language];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F7F6F3] text-[#2D2D2D]">
      <header className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8 sm:py-8">
        <a href={`${BASE_PATH}/`} className="shrink-0">
          <img
            src={`${BASE_PATH}/logo.png`}
            alt="ALADENT"
            className="h-14 w-auto sm:h-20 md:h-24"
          />
        </a>

        <nav className="hidden items-center gap-8 text-sm text-neutral-600 lg:flex">
          <a href="#about">{t.nav.about}</a>
          <a href="#services">{t.nav.services}</a>
          <a href="#prices">{t.nav.prices}</a>
          <a href="#ai">{t.nav.ai}</a>
          <a href="#contacts">{t.nav.contacts}</a>
        </nav>

        <div className="hidden gap-2 text-sm md:flex">
          <button
            onClick={() => changeLanguage("ru")}
            className={language === "ru" ? "font-medium" : "text-neutral-400"}
          >
            RU
          </button>

          <span className="text-neutral-400">/</span>

          <button
            onClick={() => changeLanguage("kz")}
            className={language === "kz" ? "font-medium" : "text-neutral-400"}
          >
            KZ
          </button>
        </div>

        <a
          href={`${BASE_PATH}/consultation/`}
          className="rounded-full bg-[#151515] px-5 py-3 text-sm text-white sm:px-7 sm:py-4 sm:text-base"
        >
          {t.nav.book}
        </a>
      </header>

      <section className="relative mx-auto max-w-7xl px-5 pb-20 pt-12 sm:px-8 sm:pb-28 sm:pt-20">
        <div className="absolute right-4 top-10 hidden h-72 w-[480px] opacity-10 md:block">
          <svg viewBox="0 0 700 300" className="h-full w-full">
            <path
              d="M20 240 L160 90 L280 240 L390 60 L670 240"
              fill="none"
              stroke="#151515"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M160 90 L210 240 M390 60 L470 240"
              fill="none"
              stroke="#151515"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <p className="mb-5 text-xs uppercase tracking-[0.35em] text-neutral-500 sm:text-sm sm:tracking-[0.45em]">
          {t.hero.label}
        </p>

        <h1 className="mb-8 max-w-5xl text-5xl font-extralight leading-[1.05] sm:text-6xl md:text-8xl">
          {t.hero.title1}
          <br />
          {t.hero.title2}
          <br />
          {t.hero.title3}
        </h1>

        <p className="mb-10 max-w-2xl text-lg leading-8 text-neutral-600 sm:text-xl sm:leading-9">
          {t.hero.text}
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <a
            href={`${BASE_PATH}/consultation/`}
            className="rounded-full bg-[#151515] px-8 py-4 text-center text-white sm:px-9 sm:py-5"
          >
            {t.hero.book}
          </a>

          <a
            href={`${BASE_PATH}/consultation/`}
            className="rounded-full border border-neutral-300 px-8 py-4 text-center sm:px-9 sm:py-5"
          >
            {t.hero.ai}
          </a>
        </div>
      </section>

      <section
        id="about"
        className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24"
      >
        <div className="mb-10 max-w-2xl sm:mb-12">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-neutral-500 sm:text-sm">
            {t.about.label}
          </p>

          <h2 className="text-3xl font-light sm:text-4xl md:text-5xl">
            {t.about.title}
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.about.cards.map(([title, text]) => (
            <div
              key={title}
              className="rounded-[2rem] border border-neutral-200 bg-white/60 p-6 sm:p-7"
            >
              <h3 className="mb-4 text-xl font-medium">{title}</h3>
              <p className="leading-7 text-neutral-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="services"
        className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24"
      >
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-neutral-500 sm:text-sm">
              {t.services.label}
            </p>

            <h2 className="text-3xl font-light sm:text-4xl md:text-5xl">
              {t.services.title}
            </h2>
          </div>

          <p className="max-w-xl leading-7 text-neutral-600">
            {t.services.text}
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.services.items.map(([title, text]) => (
            <div
              key={title}
              className="rounded-[2rem] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-8"
            >
              <div className="mb-8 text-3xl">◇</div>
              <h3 className="mb-4 text-2xl font-light">{title}</h3>
              <p className="leading-7 text-neutral-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="prices"
        className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24"
      >
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-neutral-500 sm:text-sm">
              {t.prices.label}
            </p>

            <h2 className="mb-6 text-3xl font-light sm:text-4xl md:text-5xl">
              {t.prices.title}
            </h2>

            <p className="leading-8 text-neutral-600">{t.prices.text}</p>
          </div>

          <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
            {t.prices.items.map(([service, price]) => (
              <div
                key={service}
                className="flex flex-col gap-2 border-b border-neutral-100 px-6 py-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6"
              >
                <span className="text-base sm:text-lg">{service}</span>
                <span className="text-base font-medium sm:text-lg">
                  {price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="ai"
        className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24"
      >
        <div className="relative overflow-hidden rounded-[2rem] bg-[#151515] p-8 text-white sm:rounded-[3rem] sm:p-12 md:p-16">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" />
          <div className="absolute -bottom-24 right-24 h-72 w-72 rounded-full border border-white/10" />

          <div className="relative z-10 max-w-3xl">
            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-neutral-400 sm:text-sm">
              {t.ai.label}
            </p>

            <h2 className="mb-6 text-3xl font-light sm:text-4xl md:text-6xl">
              {t.ai.title}
            </h2>

            <p className="mb-10 text-lg leading-8 text-neutral-300">
              {t.ai.text}
            </p>

            <a
              href={`${BASE_PATH}/consultation/`}
              className="inline-flex w-full items-center justify-center rounded-full bg-white px-8 py-5 text-center text-lg text-[#151515] sm:w-auto sm:px-12 sm:py-6"
            >
              {t.ai.button}
            </a>
          </div>
        </div>
      </section>

      <section
        id="contacts"
        className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24"
      >
        <div className="grid gap-10 rounded-[2rem] bg-white p-7 shadow-sm sm:rounded-[3rem] sm:p-10 md:grid-cols-2 md:p-16">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-neutral-500 sm:text-sm">
              {t.contacts.label}
            </p>

            <h2 className="mb-6 text-3xl font-light sm:text-4xl md:text-5xl">
              {t.contacts.title}
            </h2>

            <p className="mb-8 leading-8 text-neutral-600">
              {t.contacts.text}
            </p>

            <a
              href={`${BASE_PATH}/consultation/`}
              className="inline-flex rounded-full bg-[#151515] px-8 py-5 text-white"
            >
              {t.contacts.button}
            </a>
          </div>

          <div className="rounded-[2rem] bg-[#F7F6F3] p-7 sm:p-8">
            <div className="space-y-6 text-base sm:text-lg">
              <div>
                <p className="mb-1 text-sm uppercase tracking-[0.25em] text-neutral-400">
                  {t.contacts.addressLabel}
                </p>
                <p>{t.contacts.address}</p>
              </div>

              <div>
                <p className="mb-1 text-sm uppercase tracking-[0.25em] text-neutral-400">
                  {t.contacts.phoneLabel}
                </p>
                <p>{t.contacts.phone}</p>
              </div>

              <div>
                <p className="mb-1 text-sm uppercase tracking-[0.25em] text-neutral-400">
                  {t.contacts.whatsappLabel}
                </p>
                <p>{t.contacts.whatsapp}</p>
              </div>

              <div>
                <p className="mb-1 text-sm uppercase tracking-[0.25em] text-neutral-400">
                  {t.contacts.scheduleLabel}
                </p>
                <p>{t.contacts.schedule}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12">
        <div className="flex flex-col justify-between gap-6 border-t border-neutral-200 pt-8 md:flex-row md:items-center">
          <div>
            <img
              src={`${BASE_PATH}/logo.png`}
              alt="ALADENT"
              className="mb-4 h-14 w-auto sm:h-16"
            />
            <p className="text-neutral-500">{t.footer.slogan}</p>
          </div>

          <div className="flex flex-wrap gap-5 text-sm text-neutral-500 sm:gap-6">
            <a href="#services">{t.nav.services}</a>
            <a href="#prices">{t.nav.prices}</a>
            <a href="#contacts">{t.nav.contacts}</a>
            <a href={`${BASE_PATH}/consultation/`}>{t.nav.ai}</a>
          </div>
        </div>
      </footer>
    </main>
  );
}