"use client";

import { useEffect } from "react";

export default function ConsultationRedirect() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "/ai-chat";
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F6F3] px-5 text-[#2D2D2D]">
      <div className="max-w-xl text-center">
        <img
          src="/logo.png"
          alt="ALADENT"
          className="mx-auto mb-8 h-20 w-auto"
        />

        <p className="mb-4 text-sm uppercase tracking-[0.35em] text-neutral-500">
          AI-консультация
        </p>

        <h1 className="mb-6 text-4xl font-light sm:text-5xl">
          Подготавливаем чат
        </h1>

        <p className="mb-8 leading-8 text-neutral-600">
          Сейчас вы будете перенаправлены на страницу первичного AI-опроса.
        </p>

        <div className="mx-auto h-2 w-48 overflow-hidden rounded-full bg-neutral-200">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-[#151515]" />
        </div>
      </div>
    </main>
  );
}