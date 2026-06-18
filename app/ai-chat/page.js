"use client";

import { useEffect, useMemo, useState } from "react";
import { BASE_PATH } from "../../lib/paths";

const CLINIC_WHATSAPP_PHONE = "77051462776";
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz7AnI0c1RPJtVww_4rWC4i0WBsQAsf0OmwnNkpPKne7A17ATItt_wkKfjlINd9CYWKMA/exec";
const REQUEST_COOLDOWN_MS = 2 * 60 * 1000;

async function sendRequestToGoogleSheets(request) {
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes("ВСТАВЬ")) return;

  await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(request),
  });
}

function buildClinicWhatsAppText(form, recommendation, language) {
  if (language === "kz") {
    return `Сәлеметсіз бе! ALADENT клиникасына жазылғым келеді.

Аты: ${form.name || "-"}
Телефон: ${form.phone || "-"}

Себеп: ${form.concern || "-"}
Шұғылдық: ${form.urgency || "-"}
Ауырсыну: ${form.pain || "-"}
Ыңғайлы уақыт: ${form.preferredTime || "-"}
Пікір: ${form.comment || "-"}

AI ұсынысы:
${recommendation.text || "-"}`;
  }

  return `Здравствуйте! Хочу записаться в ALADENT.

Имя: ${form.name || "-"}
Телефон: ${form.phone || "-"}

Повод: ${form.concern || "-"}
Срочность: ${form.urgency || "-"}
Боль: ${form.pain || "-"}
Удобное время: ${form.preferredTime || "-"}
Комментарий: ${form.comment || "-"}

AI-рекомендация:
${recommendation.text || "-"}`;
}

const chatTranslations = {
  ru: {
    header: {
      title: "AI-консультация",
      home: "На главную",
      admin: "CRM",
    },
    progress: "Шаг",
    of: "из",
    common: {
      back: "Назад",
      next: "Далее",
      finish: "Сохранить заявку",
      optional: "необязательно",
    },
    steps: [
      {
        key: "concern",
        title: "Что вас беспокоит?",
        subtitle: "Выберите основной повод обращения.",
        type: "options",
        options: [
          "Болит зуб",
          "Нужна консультация",
          "Профессиональная чистка",
          "Эстетика / реставрация",
          "Имплантация",
          "Ортодонтия",
          "Другое",
        ],
      },
      {
        key: "urgency",
        title: "Насколько срочно?",
        subtitle: "Это поможет администратору правильно расставить приоритет.",
        type: "options",
        options: [
          "Очень срочно",
          "В ближайшие дни",
          "На этой неделе",
          "Плановый визит",
        ],
      },
      {
        key: "pain",
        title: "Есть ли боль?",
        subtitle: "Оцените состояние сейчас.",
        type: "options",
        options: [
          "Нет боли",
          "Легкий дискомфорт",
          "Средняя боль",
          "Сильная боль",
          "Болит при жевании",
          "Болит ночью",
        ],
      },
      {
        key: "preferredTime",
        title: "Когда вам удобно прийти?",
        subtitle: "Выберите предпочтительное время.",
        type: "options",
        options: ["Утром", "Днем", "Вечером", "В выходные", "Любое время"],
      },
      {
        key: "contacts",
        title: "Как с вами связаться?",
        subtitle: "Оставьте имя и телефон для администратора.",
        type: "contacts",
      },
      {
        key: "comment",
        title: "Дополнительный комментарий",
        subtitle: "Можете кратко описать ситуацию своими словами.",
        type: "comment",
      },
    ],
    fields: {
      name: "Ваше имя",
      phone: "Телефон",
      comment: "Комментарий",
    },
    placeholders: {
      name: "Например: Даурен",
      phone: "+7 ...",
      comment: "Например: зуб реагирует на холодное, хочу записаться вечером",
    },
    recommendation: {
      urgentTitle: "Рекомендация",
      urgentText:
        "Похоже, лучше не откладывать визит. Администратор сможет быстрее сориентировать вас по ближайшему времени.",
      normalTitle: "Рекомендация",
      normalText:
        "Ситуация выглядит подходящей для плановой консультации. Администратор уточнит детали и предложит удобное время.",
    },
    summary: {
      title: "Заявка подготовлена",
      text: "Теперь отправьте заявку в WhatsApp клиники. Мы подготовили сообщение автоматически — вам останется только нажать отправить.",
      sendWhatsApp: "Отправить в WhatsApp",
      newRequest: "Создать новую заявку",
      goAdmin: "Открыть CRM",
      home: "На главную",
      saved: "Заявка сохранена",
    },
    crmStatus: {
      sending: "Заявка отправляется в CRM...",
      sent: "Заявка отправлена в Google Sheets CRM.",
      error:
        "Не получилось отправить заявку в CRM. WhatsApp-кнопка ниже всё равно работает.",
      cooldown:
        "Заявка уже была отправлена недавно. Если нужно срочно связаться с клиникой, используйте кнопку WhatsApp ниже.",
    },
    requestLabels: {
      concern: "Повод",
      urgency: "Срочность",
      pain: "Боль",
      preferredTime: "Удобное время",
      name: "Имя",
      phone: "Телефон",
      comment: "Комментарий",
    },
  },

  kz: {
    header: {
      title: "AI-кеңес",
      home: "Басты бет",
      admin: "CRM",
    },
    progress: "Қадам",
    of: "ішінен",
    common: {
      back: "Артқа",
      next: "Әрі қарай",
      finish: "Өтінімді сақтау",
      optional: "міндетті емес",
    },
    steps: [
      {
        key: "concern",
        title: "Сізді не мазалайды?",
        subtitle: "Қаралудың негізгі себебін таңдаңыз.",
        type: "options",
        options: [
          "Тіс ауырады",
          "Кеңес керек",
          "Кәсіби тазалау",
          "Эстетика / реставрация",
          "Имплантация",
          "Ортодонтия",
          "Басқа",
        ],
      },
      {
        key: "urgency",
        title: "Қаншалықты шұғыл?",
        subtitle: "Бұл әкімшіге өтінімді дұрыс басымдықпен қарауға көмектеседі.",
        type: "options",
        options: ["Өте шұғыл", "Жақын күндері", "Осы аптада", "Жоспарлы қабылдау"],
      },
      {
        key: "pain",
        title: "Ауырсыну бар ма?",
        subtitle: "Қазіргі жағдайыңызды бағалаңыз.",
        type: "options",
        options: [
          "Ауырсыну жоқ",
          "Жеңіл жайсыздық",
          "Орташа ауырсыну",
          "Қатты ауырсыну",
          "Шайнағанда ауырады",
          "Түнде ауырады",
        ],
      },
      {
        key: "preferredTime",
        title: "Қай уақытта келу ыңғайлы?",
        subtitle: "Өзіңізге ыңғайлы уақытты таңдаңыз.",
        type: "options",
        options: ["Таңертең", "Күндіз", "Кешке", "Демалыс күндері", "Кез келген уақыт"],
      },
      {
        key: "contacts",
        title: "Сізбен қалай байланысайық?",
        subtitle: "Әкімші үшін атыңыз бен телефоныңызды қалдырыңыз.",
        type: "contacts",
      },
      {
        key: "comment",
        title: "Қосымша пікір",
        subtitle: "Жағдайды қысқаша өз сөзіңізбен сипаттай аласыз.",
        type: "comment",
      },
    ],
    fields: {
      name: "Атыңыз",
      phone: "Телефон",
      comment: "Пікір",
    },
    placeholders: {
      name: "Мысалы: Дәурен",
      phone: "+7 ...",
      comment: "Мысалы: тіс суыққа сезімтал, кешке жазылғым келеді",
    },
    recommendation: {
      urgentTitle: "Ұсыныс",
      urgentText:
        "Қабылдауды кейінге қалдырмаған дұрыс сияқты. Әкімші сізге жақын уақыттарды тезірек ұсына алады.",
      normalTitle: "Ұсыныс",
      normalText:
        "Жағдай жоспарлы кеңеске сай келеді. Әкімші мәліметтерді нақтылап, ыңғайлы уақыт ұсынады.",
    },
    summary: {
      title: "Өтінім дайындалды",
      text: "Енді өтінімді клиниканың WhatsApp нөміріне жіберіңіз. Хабарлама автоматты түрде дайындалды — тек жіберу батырмасын басу керек.",
      sendWhatsApp: "WhatsApp арқылы жіберу",
      newRequest: "Жаңа өтінім жасау",
      goAdmin: "CRM ашу",
      home: "Басты бет",
      saved: "Өтінім сақталды",
    },
    crmStatus: {
      sending: "Өтінім CRM жүйесіне жіберіліп жатыр...",
      sent: "Өтінім Google Sheets CRM жүйесіне жіберілді.",
      error:
        "Өтінімді CRM жүйесіне жіберу мүмкін болмады. Төмендегі WhatsApp батырмасы жұмыс істейді.",
      cooldown:
        "Өтінім жақында жіберілген. Шұғыл байланысу керек болса, төмендегі WhatsApp батырмасын пайдаланыңыз.",
    },
    requestLabels: {
      concern: "Себеп",
      urgency: "Шұғылдық",
      pain: "Ауырсыну",
      preferredTime: "Ыңғайлы уақыт",
      name: "Аты",
      phone: "Телефон",
      comment: "Пікір",
    },
  },
};

export default function AiChatPage() {
  const [language, setLanguage] = useState("ru");
  const [step, setStep] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [sheetStatus, setSheetStatus] = useState("idle");

  const [form, setForm] = useState({
    concern: "",
    urgency: "",
    pain: "",
    preferredTime: "",
    name: "",
    phone: "",
    comment: "",
    website: "",
  });

  useEffect(() => {
    const savedLanguage = localStorage.getItem("aladent_language");

    if (savedLanguage === "ru" || savedLanguage === "kz") {
      setLanguage(savedLanguage);
    }
  }, []);

  const t = chatTranslations[language];
  const currentStep = t.steps[step];

  const isUrgent = useMemo(() => {
    const urgentValues = [
      "Очень срочно",
      "Сильная боль",
      "Болит ночью",
      "Өте шұғыл",
      "Қатты ауырсыну",
      "Түнде ауырады",
    ];

    return urgentValues.includes(form.urgency) || urgentValues.includes(form.pain);
  }, [form.urgency, form.pain]);

  const recommendation = isUrgent
    ? {
        title: t.recommendation.urgentTitle,
        text: t.recommendation.urgentText,
      }
    : {
        title: t.recommendation.normalTitle,
        text: t.recommendation.normalText,
      };

  const clinicWhatsAppUrl = `https://wa.me/${CLINIC_WHATSAPP_PHONE}?text=${encodeURIComponent(
    buildClinicWhatsAppText(form, recommendation, language)
  )}`;

  const canGoNext = useMemo(() => {
    if (currentStep.type === "options") {
      return Boolean(form[currentStep.key]);
    }

    if (currentStep.type === "contacts") {
      return Boolean(form.name.trim()) && Boolean(form.phone.trim());
    }

    return true;
  }, [currentStep, form]);

  const updateField = (key, value) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const saveRequest = async () => {
    if (sheetStatus === "sending") return;

    if (form.website) {
      setIsSaved(true);
      setSheetStatus("sent");
      return;
    }

    const now = Date.now();
    const lastSentAt = Number(
      localStorage.getItem("aladent_last_request_sent_at") || "0"
    );

    if (lastSentAt && now - lastSentAt < REQUEST_COOLDOWN_MS) {
      setIsSaved(true);
      setSheetStatus("cooldown");
      return;
    }

    const previousRequests = JSON.parse(
      localStorage.getItem("aladent_requests") || "[]"
    );

    const request = {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : String(Date.now()),
      createdAt: new Date().toLocaleString(),
      submittedAt: new Date().toISOString(),
      status: "new",
      language,
      concern: form.concern,
      urgency: form.urgency,
      pain: form.pain,
      preferredTime: form.preferredTime,
      name: form.name,
      phone: form.phone,
      comment: form.comment,
      recommendation: recommendation.text,
      source: "aladent-site",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      website: form.website,
    };

    localStorage.setItem(
      "aladent_requests",
      JSON.stringify([request, ...previousRequests])
    );

    setIsSaved(true);
    setSheetStatus("sending");

    try {
      await sendRequestToGoogleSheets(request);
      localStorage.setItem("aladent_last_request_sent_at", String(now));
      setSheetStatus("sent");
    } catch (error) {
      console.error(error);
      setSheetStatus("error");
    }
  };

  const nextStep = () => {
    if (!canGoNext) return;

    if (step < t.steps.length - 1) {
      setStep(step + 1);
      return;
    }

    saveRequest();
  };

  const previousStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const resetForm = () => {
    setStep(0);
    setIsSaved(false);
    setSheetStatus("idle");

    setForm({
      concern: "",
      urgency: "",
      pain: "",
      preferredTime: "",
      name: "",
      phone: "",
      comment: "",
      website: "",
    });
  };

  const changeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    localStorage.setItem("aladent_language", nextLanguage);
  };

  const optionButton = (value) => (
    <button
      key={value}
      onClick={() => updateField(currentStep.key, value)}
      className={`rounded-2xl border px-5 py-4 text-left transition ${
        form[currentStep.key] === value
          ? "border-[#151515] bg-[#151515] text-white"
          : "border-neutral-200 bg-white text-[#2D2D2D] hover:border-neutral-400"
      }`}
    >
      {value}
    </button>
  );

  if (isSaved) {
    return (
      <main className="min-h-screen bg-[#F7F6F3] px-5 py-8 text-[#2D2D2D] sm:px-8">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12 flex items-center justify-between gap-4">
            <a href={`${BASE_PATH}/`}>
              <img
                src={`${BASE_PATH}/logo.png`}
                alt="ALADENT"
                className="h-14 w-auto sm:h-20"
              />
            </a>

            <div className="flex items-center gap-3 text-sm">
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
          </header>

          <section className="rounded-[2rem] bg-white p-7 shadow-sm sm:p-10 md:p-14">
            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-neutral-400">
              {t.summary.saved}
            </p>

            <h1 className="mb-6 text-4xl font-light sm:text-5xl">
              {t.summary.title}
            </h1>

            <p className="mb-8 max-w-2xl leading-8 text-neutral-600">
              {t.summary.text}
            </p>

            <div className="mb-8 rounded-2xl bg-[#F7F6F3] p-5 text-sm">
              {sheetStatus === "sending" && (
                <p className="text-neutral-600">{t.crmStatus.sending}</p>
              )}

              {sheetStatus === "sent" && (
                <p className="text-green-700">{t.crmStatus.sent}</p>
              )}

              {sheetStatus === "error" && (
                <p className="text-red-600">{t.crmStatus.error}</p>
              )}

              {sheetStatus === "cooldown" && (
                <p className="text-amber-700">{t.crmStatus.cooldown}</p>
              )}
            </div>

            <div className="mb-10 rounded-[2rem] bg-[#F7F6F3] p-6">
              <h2 className="mb-4 text-xl font-medium">{recommendation.title}</h2>
              <p className="leading-7 text-neutral-600">{recommendation.text}</p>
            </div>

            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <SummaryRow label={t.requestLabels.concern} value={form.concern} />
              <SummaryRow label={t.requestLabels.urgency} value={form.urgency} />
              <SummaryRow label={t.requestLabels.pain} value={form.pain} />
              <SummaryRow
                label={t.requestLabels.preferredTime}
                value={form.preferredTime}
              />
              <SummaryRow label={t.requestLabels.name} value={form.name} />
              <SummaryRow label={t.requestLabels.phone} value={form.phone} />
            </div>

            {form.comment && (
              <div className="mt-3 rounded-2xl bg-[#F7F6F3] p-5">
                <p className="mb-1 text-xs uppercase tracking-[0.25em] text-neutral-400">
                  {t.requestLabels.comment}
                </p>
                <p>{form.comment}</p>
              </div>
            )}

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href={clinicWhatsAppUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-green-600 px-7 py-4 text-center text-white"
              >
                {t.summary.sendWhatsApp}
              </a>

              <button
                onClick={resetForm}
                className="rounded-full border border-neutral-300 px-7 py-4"
              >
                {t.summary.newRequest}
              </button>

              <a
                href={`${BASE_PATH}/admin/`}
                className="rounded-full bg-[#151515] px-7 py-4 text-center text-white"
              >
                {t.summary.goAdmin}
              </a>

              <a
                href={`${BASE_PATH}/`}
                className="rounded-full border border-neutral-300 px-7 py-4 text-center"
              >
                {t.summary.home}
              </a>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F6F3] px-5 py-8 text-[#2D2D2D] sm:px-8">
      <div className="mx-auto max-w-5xl">
        <input
          type="text"
          name="website"
          value={form.website}
          onChange={(event) => updateField("website", event.target.value)}
          tabIndex="-1"
          autoComplete="off"
          className="hidden"
        />

        <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <a href={`${BASE_PATH}/`}>
            <img
              src={`${BASE_PATH}/logo.png`}
              alt="ALADENT"
              className="h-14 w-auto sm:h-20"
            />
          </a>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 text-sm">
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
              href={`${BASE_PATH}/admin/`}
              className="rounded-full border border-neutral-300 px-5 py-3 text-sm"
            >
              {t.header.admin}
            </a>

            <a
              href={`${BASE_PATH}/`}
              className="rounded-full bg-[#151515] px-5 py-3 text-sm text-white"
            >
              {t.header.home}
            </a>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] bg-white p-7 shadow-sm sm:p-10 md:p-12">
            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-neutral-400">
              {t.header.title}
            </p>

            <h1 className="mb-3 text-3xl font-light sm:text-4xl md:text-5xl">
              {currentStep.title}
            </h1>

            <p className="mb-8 leading-8 text-neutral-600">
              {currentStep.subtitle}
            </p>

            <div className="mb-8">
              <div className="mb-2 flex justify-between text-sm text-neutral-500">
                <span>
                  {t.progress} {step + 1} {t.of} {t.steps.length}
                </span>
                <span>{Math.round(((step + 1) / t.steps.length) * 100)}%</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-[#151515] transition-all"
                  style={{
                    width: `${((step + 1) / t.steps.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {currentStep.type === "options" && (
              <div className="grid gap-3 sm:grid-cols-2">
                {currentStep.options.map(optionButton)}
              </div>
            )}

            {currentStep.type === "contacts" && (
              <div className="grid gap-4">
                <label className="block">
                  <span className="mb-2 block text-sm text-neutral-500">
                    {t.fields.name}
                  </span>
                  <input
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    placeholder={t.placeholders.name}
                    className="w-full rounded-2xl border border-neutral-200 bg-white px-5 py-4 outline-none focus:border-[#151515]"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-neutral-500">
                    {t.fields.phone}
                  </span>
                  <input
                    value={form.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                    placeholder={t.placeholders.phone}
                    className="w-full rounded-2xl border border-neutral-200 bg-white px-5 py-4 outline-none focus:border-[#151515]"
                  />
                </label>
              </div>
            )}

            {currentStep.type === "comment" && (
              <label className="block">
                <span className="mb-2 block text-sm text-neutral-500">
                  {t.fields.comment} ({t.common.optional})
                </span>

                <textarea
                  value={form.comment}
                  onChange={(event) => updateField("comment", event.target.value)}
                  placeholder={t.placeholders.comment}
                  rows={5}
                  className="w-full resize-none rounded-2xl border border-neutral-200 bg-white px-5 py-4 outline-none focus:border-[#151515]"
                />
              </label>
            )}

            <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button
                onClick={previousStep}
                disabled={step === 0}
                className="rounded-full border border-neutral-300 px-7 py-4 disabled:cursor-not-allowed disabled:opacity-30"
              >
                {t.common.back}
              </button>

              <button
                onClick={nextStep}
                disabled={!canGoNext}
                className="rounded-full bg-[#151515] px-7 py-4 text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                {step === t.steps.length - 1 ? t.common.finish : t.common.next}
              </button>
            </div>
          </div>

          <aside className="rounded-[2rem] bg-[#151515] p-7 text-white shadow-sm sm:p-8">
            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-neutral-400">
              {recommendation.title}
            </p>

            <p className="mb-8 leading-8 text-neutral-300">
              {recommendation.text}
            </p>

            <div className="space-y-3 text-sm">
              <PreviewRow label={t.requestLabels.concern} value={form.concern} />
              <PreviewRow label={t.requestLabels.urgency} value={form.urgency} />
              <PreviewRow label={t.requestLabels.pain} value={form.pain} />
              <PreviewRow
                label={t.requestLabels.preferredTime}
                value={form.preferredTime}
              />
              <PreviewRow label={t.requestLabels.name} value={form.name} />
              <PreviewRow label={t.requestLabels.phone} value={form.phone} />
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

function PreviewRow({ label, value }) {
  if (!value) return null;

  return (
    <div className="rounded-2xl bg-white/10 p-4">
      <p className="mb-1 text-xs uppercase tracking-[0.25em] text-neutral-400">
        {label}
      </p>
      <p>{value}</p>
    </div>
  );
}

function SummaryRow({ label, value }) {
  if (!value) return null;

  return (
    <div className="rounded-2xl bg-[#F7F6F3] p-5">
      <p className="mb-1 text-xs uppercase tracking-[0.25em] text-neutral-400">
        {label}
      </p>
      <p>{value}</p>
    </div>
  );
}