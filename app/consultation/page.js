"use client";

import { useEffect, useState } from "react";
import { BASE_PATH } from "../../lib/paths";

const consultationTranslations = {
  ru: {
    label: "AI-консультация",
    title: "Подготавливаем чат",
    text: "Сейчас вы будете перенаправлены на страницу первичного AI-опроса.",
  },
  kz: {
    label: "AI-кеңес",
    title: "Чат дайындалып жатыр",
    text: "Қазір сіз бастапқы AI-сауалнама бетіне бағытталасыз.",
  },
};

export default function ConsultationRedirect() {
  const [language, setLanguage] = useState("ru");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("aladent_language");

    if (savedLanguage === "ru" || savedLanguage === "kz") {
      setLanguage(savedLanguage);
    }

    const timer = setTimeout(() => {
      window.location.href = `${BASE_PATH}/ai-chat/`;
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const t = consultationTranslations[language];

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F6F3] px-5 text-[#2D2D2D]">
      <div className="max-w-xl text-center">
        <img
          src={`${BASE_PATH}/logo.png`}
          alt="ALADENT"
          className="mx-auto mb-8 h-20 w-auto"
        />

        <p className="mb-4 text-sm uppercase tracking-[0.35em] text-neutral-500">
          {t.label}
        </p>

        <h1 className="mb-6 text-4xl font-light sm:text-5xl">
          {t.title}
        </h1>

        <p className="mb-8 leading-8 text-neutral-600">
          {t.text}
        </p>

        <div className="mx-auto h-2 w-48 overflow-hidden rounded-full bg-neutral-200">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-[#151515]" />
        </div>
      </div>
    </main>
  );
}