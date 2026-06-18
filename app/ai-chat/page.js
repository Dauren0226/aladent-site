"use client";

import { useMemo, useState } from "react";

import { BASE_PATH } from "../../lib/paths";

export default function AiChatPage() {
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [savedRequestId, setSavedRequestId] = useState(null);

  const [form, setForm] = useState({
    concern: "",
    urgency: "",
    pain: "",
    preferredTime: "",
    name: "",
    phone: "",
    comment: "",
  });

  const updateForm = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const recommendation = useMemo(() => {
    if (form.pain === "Сильная" || form.urgency === "Сегодня / завтра") {
      return "Срочная заявка. Желательно связаться с пациентом как можно быстрее.";
    }

    if (form.concern === "Болит зуб" || form.concern === "Лечение кариеса") {
      return "Передать администратору для записи на консультацию/осмотр.";
    }

    return "Плановая заявка. Можно предложить ближайшие удобные слоты.";
  }, [form]);

  const summaryText = `
Новая заявка ALADENT

Имя: ${form.name || "Не указано"}
Телефон: ${form.phone || "Не указано"}

Причина обращения: ${form.concern || "Не указано"}
Срочность: ${form.urgency || "Не указано"}
Боль: ${form.pain || "Не указано"}
Удобное время: ${form.preferredTime || "Не указано"}

Комментарий пациента:
${form.comment || "Нет комментария"}

Рекомендация системы:
${recommendation}
`;

  const saveRequestToCRM = () => {
    const newRequest = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: "Новая",
      name: form.name,
      phone: form.phone,
      concern: form.concern,
      urgency: form.urgency,
      pain: form.pain,
      preferredTime: form.preferredTime,
      comment: form.comment,
      recommendation,
    };

    const existingRequests = JSON.parse(
      localStorage.getItem("aladent_requests") || "[]"
    );

    const updatedRequests = [newRequest, ...existingRequests];

    localStorage.setItem("aladent_requests", JSON.stringify(updatedRequests));

    setSavedRequestId(newRequest.id);
  };

  const copySummary = async () => {
    await navigator.clipboard.writeText(summaryText);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const canGoNext = () => {
    if (step === 0) return form.concern;
    if (step === 1) return form.urgency;
    if (step === 2) return form.pain;
    if (step === 3) return form.preferredTime;
    if (step === 4) return form.name.trim().length > 1;
    if (step === 5) return form.phone.trim().length > 5;
    return true;
  };

  const nextStep = () => {
    if (step === 5) {
      saveRequestToCRM();
      setStep(6);
      return;
    }

    if (step < 6) {
      setStep(step + 1);
    }
  };

  const previousStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const optionButton = (key, value) => (
    <button
      onClick={() => updateForm(key, value)}
      className={`w-full rounded-2xl border px-5 py-4 text-left transition ${
        form[key] === value
          ? "border-[#151515] bg-[#151515] text-white"
          : "border-neutral-200 bg-white hover:bg-[#F7F6F3]"
      }`}
    >
      {value}
    </button>
  );

  return (
    <main className="min-h-screen bg-[#F7F6F3] px-5 py-8 text-[#2D2D2D] sm:px-8">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <a href={`${BASE_PATH}/`}>
          <img src={`${BASE_PATH}/logo.png`} alt="ALADENT" className="h-14 w-auto sm:h-16" />
        </a>

        <div className="flex gap-2">
          <a
            href="/admin"
            className="rounded-full border border-neutral-300 px-5 py-3 text-sm"
          >
            CRM
          </a>

          <a
            href={`${BASE_PATH}/`}
            className="rounded-full border border-neutral-300 px-5 py-3 text-sm"
          >
            На главную
          </a>
        </div>
      </div>

      <section className="mx-auto mt-10 max-w-4xl rounded-[2rem] bg-white p-6 shadow-sm sm:mt-16 sm:p-10">
        <div className="mb-8">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-neutral-500 sm:text-sm">
            AI-опрос
          </p>

          <h1 className="mb-4 text-3xl font-light sm:text-5xl">
            Расскажите, что вас беспокоит
          </h1>

          <p className="leading-7 text-neutral-600">
            Ответьте на несколько вопросов. Мы подготовим заявку для
            администратора и врача.
          </p>
        </div>

        {step < 6 && (
          <div className="mb-8">
            <div className="mb-3 flex justify-between text-sm text-neutral-500">
              <span>Шаг {step + 1} из 6</span>
              <span>{Math.round(((step + 1) / 6) * 100)}%</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-full rounded-full bg-[#151515] transition-all"
                style={{ width: `${((step + 1) / 6) * 100}%` }}
              />
            </div>
          </div>
        )}

        {step === 0 && (
          <div>
            <h2 className="mb-6 text-2xl font-light">Что вас беспокоит?</h2>

            <div className="space-y-3">
              {optionButton("concern", "Болит зуб")}
              {optionButton("concern", "Нужна профессиональная чистка")}
              {optionButton("concern", "Лечение кариеса")}
              {optionButton("concern", "Консультация по имплантации")}
              {optionButton("concern", "Ортодонтия / брекеты")}
              {optionButton("concern", "Эстетика улыбки")}
              {optionButton("concern", "Другое")}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="mb-6 text-2xl font-light">Насколько срочно?</h2>

            <div className="space-y-3">
              {optionButton("urgency", "Сегодня / завтра")}
              {optionButton("urgency", "В течение недели")}
              {optionButton("urgency", "Планово")}
              {optionButton("urgency", "Пока хочу только консультацию")}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="mb-6 text-2xl font-light">Есть ли боль?</h2>

            <div className="space-y-3">
              {optionButton("pain", "Нет боли")}
              {optionButton("pain", "Слабая")}
              {optionButton("pain", "Средняя")}
              {optionButton("pain", "Сильная")}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="mb-6 text-2xl font-light">
              Когда вам удобно прийти?
            </h2>

            <div className="space-y-3">
              {optionButton("preferredTime", "Утром")}
              {optionButton("preferredTime", "Днем")}
              {optionButton("preferredTime", "Вечером")}
              {optionButton("preferredTime", "В любое время")}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="mb-6 text-2xl font-light">Как вас зовут?</h2>

            <input
              value={form.name}
              onChange={(event) => updateForm("name", event.target.value)}
              className="w-full rounded-2xl border border-neutral-200 bg-[#F7F6F3] px-5 py-4 outline-none"
              placeholder="Введите имя"
            />
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 className="mb-6 text-2xl font-light">Ваш номер телефона</h2>

            <input
              value={form.phone}
              onChange={(event) => updateForm("phone", event.target.value)}
              className="w-full rounded-2xl border border-neutral-200 bg-[#F7F6F3] px-5 py-4 outline-none"
              placeholder="+7 ..."
            />

            <textarea
              value={form.comment}
              onChange={(event) => updateForm("comment", event.target.value)}
              className="mt-4 h-32 w-full rounded-2xl border border-neutral-200 bg-[#F7F6F3] px-5 py-4 outline-none"
              placeholder="Дополнительный комментарий, если нужно"
            />
          </div>
        )}

        {step === 6 && (
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-neutral-500 sm:text-sm">
              Заявка сохранена
            </p>

            <h2 className="mb-4 text-3xl font-light sm:text-4xl">
              Спасибо, {form.name}
            </h2>

            <p className="mb-8 leading-7 text-neutral-600">
              Заявка сохранена в локальную CRM. Администратор сможет увидеть ее
              на странице управления заявками.
            </p>

            <div className="mb-8 rounded-2xl border border-green-200 bg-green-50 p-5 text-green-900">
              ID заявки: {savedRequestId}
            </div>

            <div className="space-y-4 rounded-[2rem] bg-[#F7F6F3] p-6">
              <div className="flex flex-col gap-1 border-b border-neutral-200 pb-4 sm:flex-row sm:justify-between">
                <span className="text-neutral-500">Причина обращения</span>
                <span className="font-medium">{form.concern}</span>
              </div>

              <div className="flex flex-col gap-1 border-b border-neutral-200 pb-4 sm:flex-row sm:justify-between">
                <span className="text-neutral-500">Срочность</span>
                <span className="font-medium">{form.urgency}</span>
              </div>

              <div className="flex flex-col gap-1 border-b border-neutral-200 pb-4 sm:flex-row sm:justify-between">
                <span className="text-neutral-500">Боль</span>
                <span className="font-medium">{form.pain}</span>
              </div>

              <div className="flex flex-col gap-1 border-b border-neutral-200 pb-4 sm:flex-row sm:justify-between">
                <span className="text-neutral-500">Удобное время</span>
                <span className="font-medium">{form.preferredTime}</span>
              </div>

              <div className="flex flex-col gap-1 border-b border-neutral-200 pb-4 sm:flex-row sm:justify-between">
                <span className="text-neutral-500">Телефон</span>
                <span className="font-medium">{form.phone}</span>
              </div>

              {form.comment && (
                <div className="border-b border-neutral-200 pb-4">
                  <span className="text-neutral-500">Комментарий</span>
                  <p className="mt-2 leading-7">{form.comment}</p>
                </div>
              )}

              <div>
                <span className="text-neutral-500">Рекомендация системы</span>
                <p className="mt-2 font-medium leading-7">{recommendation}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="/admin"
                className="rounded-full bg-[#151515] px-8 py-4 text-center text-white"
              >
                Открыть CRM
              </a>

              <button
                onClick={copySummary}
                className="rounded-full border border-neutral-300 px-8 py-4"
              >
                {copied ? "Скопировано" : "Скопировать заявку"}
              </button>

              <a
                href={`${BASE_PATH}/`}
                className="rounded-full border border-neutral-300 px-8 py-4 text-center"
              >
                На главную
              </a>
            </div>
          </div>
        )}

        {step < 6 && (
          <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button
              onClick={previousStep}
              disabled={step === 0}
              className={`rounded-full border px-8 py-4 ${
                step === 0
                  ? "cursor-not-allowed border-neutral-200 text-neutral-300"
                  : "border-neutral-300"
              }`}
            >
              Назад
            </button>

            <button
              onClick={nextStep}
              disabled={!canGoNext()}
              className={`rounded-full px-8 py-4 text-white ${
                canGoNext()
                  ? "bg-[#151515]"
                  : "cursor-not-allowed bg-neutral-300"
              }`}
            >
              {step === 5 ? "Сохранить заявку" : "Далее"}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}