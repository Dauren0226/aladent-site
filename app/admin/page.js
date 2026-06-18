"use client";

import { useEffect, useMemo, useState } from "react";
import { BASE_PATH } from "../../lib/paths";

const STATUS_OPTIONS = [
  { value: "new", label: "Новая" },
  { value: "contacted", label: "Связались" },
  { value: "booked", label: "Записан" },
  { value: "done", label: "Завершено" },
  { value: "cancelled", label: "Отменено" },
];

function getStatusLabel(status) {
  return STATUS_OPTIONS.find((item) => item.value === status)?.label || "Новая";
}

function normalizePhone(phone) {
  if (!phone) return "";

  let digits = phone.replace(/\D/g, "");

  if (digits.length === 10) {
    digits = `7${digits}`;
  }

  if (digits.startsWith("8") && digits.length === 11) {
    digits = `7${digits.slice(1)}`;
  }

  return digits;
}

function buildWhatsAppText(request) {
  const name = request.name?.trim() || "Здравствуйте";
  const concern = request.concern || "консультация";

  if (request.language === "kz") {
    return `Сәлеметсіз бе, ${name}! Сіз ALADENT клиникасында "${concern}" бойынша өтінім қалдырдыңыз. Қай уақытта келу сізге ыңғайлы?`;
  }

  return `Здравствуйте, ${name}! Вы оставили заявку в ALADENT по поводу: "${concern}". Когда вам будет удобно прийти на консультацию?`;
}

function buildWhatsAppUrl(request) {
  const phone = normalizePhone(request.phone);
  const text = encodeURIComponent(buildWhatsAppText(request));

  if (!phone) return "";

  return `https://wa.me/${phone}?text=${text}`;
}

function buildCopyText(request) {
  return `Заявка ALADENT

Дата: ${request.createdAt || "-"}
Язык: ${request.language === "kz" ? "KZ" : "RU"}
Статус: ${getStatusLabel(request.status)}

Имя: ${request.name || "-"}
Телефон: ${request.phone || "-"}

Повод: ${request.concern || "-"}
Срочность: ${request.urgency || "-"}
Боль: ${request.pain || "-"}
Удобное время: ${request.preferredTime || "-"}
Комментарий: ${request.comment || "-"}

Рекомендация:
${request.recommendation || "-"}`;
}

export default function AdminPage() {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState("");

  useEffect(() => {
    try {
      const savedRequests = JSON.parse(
        localStorage.getItem("aladent_requests") || "[]"
      );

      setRequests(savedRequests);
    } catch {
      setRequests([]);
    }
  }, []);

  const saveRequests = (nextRequests) => {
    setRequests(nextRequests);
    localStorage.setItem("aladent_requests", JSON.stringify(nextRequests));
  };

  const updateStatus = (requestId, nextStatus) => {
    const nextRequests = requests.map((request) =>
      request.id === requestId ? { ...request, status: nextStatus } : request
    );

    saveRequests(nextRequests);
  };

  const deleteRequest = (requestId) => {
    const confirmed = window.confirm("Удалить эту заявку?");

    if (!confirmed) return;

    const nextRequests = requests.filter((request) => request.id !== requestId);
    saveRequests(nextRequests);
  };

  const clearAllRequests = () => {
    const confirmed = window.confirm("Удалить все заявки?");

    if (!confirmed) return;

    saveRequests([]);
  };

  const copyRequest = async (request) => {
    const text = buildCopyText(request);

    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(request.id);

      setTimeout(() => {
        setCopiedId("");
      }, 1500);
    } catch {
      alert("Не получилось скопировать заявку");
    }
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesStatus =
        statusFilter === "all" || request.status === statusFilter;

      const query = searchQuery.trim().toLowerCase();

      const searchableText = [
        request.name,
        request.phone,
        request.concern,
        request.urgency,
        request.pain,
        request.preferredTime,
        request.comment,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [requests, statusFilter, searchQuery]);

  const counters = useMemo(() => {
    return STATUS_OPTIONS.reduce(
      (acc, status) => {
        acc[status.value] = requests.filter(
          (request) => request.status === status.value
        ).length;

        return acc;
      },
      { all: requests.length }
    );
  }, [requests]);

  return (
    <main className="min-h-screen bg-[#F7F6F3] px-5 py-8 text-[#2D2D2D] sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <a href={`${BASE_PATH}/`}>
            <img
              src={`${BASE_PATH}/logo.png`}
              alt="ALADENT"
              className="h-14 w-auto sm:h-20"
            />
          </a>

          <div className="flex flex-wrap gap-3">
            <a
              href={`${BASE_PATH}/ai-chat/`}
              className="rounded-full border border-neutral-300 px-5 py-3 text-sm"
            >
              Создать заявку
            </a>

            <a
              href={`${BASE_PATH}/`}
              className="rounded-full bg-[#151515] px-5 py-3 text-sm text-white"
            >
              На главную
            </a>
          </div>
        </header>

        <section className="mb-8 rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.35em] text-neutral-400">
                ALADENT CRM
              </p>

              <h1 className="text-3xl font-light sm:text-5xl">
                Заявки пациентов
              </h1>
            </div>

            <div className="text-sm text-neutral-500">
              Всего заявок:{" "}
              <span className="font-medium text-[#151515]">
                {requests.length}
              </span>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_0.7fr]">
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Поиск по имени, телефону, причине..."
              className="w-full rounded-2xl border border-neutral-200 bg-[#F7F6F3] px-5 py-4 outline-none focus:border-[#151515]"
            />

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-2xl border border-neutral-200 bg-[#F7F6F3] px-5 py-4 outline-none focus:border-[#151515]"
            >
              <option value="all">Все заявки ({counters.all})</option>

              {STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label} ({counters[status.value] || 0})
                </option>
              ))}
            </select>
          </div>
        </section>

        {requests.length > 0 && (
          <div className="mb-6 flex justify-end">
            <button
              onClick={clearAllRequests}
              className="rounded-full border border-red-200 px-5 py-3 text-sm text-red-600 hover:bg-red-50"
            >
              Очистить все заявки
            </button>
          </div>
        )}

        {filteredRequests.length === 0 ? (
          <section className="rounded-[2rem] bg-white p-10 text-center shadow-sm">
            <h2 className="mb-4 text-3xl font-light">Заявок нет</h2>

            <p className="mb-8 text-neutral-600">
              Пока нет заявок по выбранному фильтру.
            </p>

            <a
              href={`${BASE_PATH}/ai-chat/`}
              className="inline-flex rounded-full bg-[#151515] px-7 py-4 text-white"
            >
              Создать тестовую заявку
            </a>
          </section>
        ) : (
          <section className="grid gap-5">
            {filteredRequests.map((request) => {
              const whatsAppUrl = buildWhatsAppUrl(request);

              return (
                <article
                  key={request.id}
                  className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8"
                >
                  <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                    <div>
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#151515] px-3 py-1 text-xs text-white">
                          {request.language === "kz" ? "KZ" : "RU"}
                        </span>

                        <span className="rounded-full bg-[#F7F6F3] px-3 py-1 text-xs text-neutral-600">
                          {getStatusLabel(request.status)}
                        </span>

                        <span className="text-sm text-neutral-400">
                          {request.createdAt || "Дата не указана"}
                        </span>
                      </div>

                      <h2 className="text-2xl font-light sm:text-3xl">
                        {request.name || "Без имени"}
                      </h2>

                      <p className="mt-2 text-neutral-600">
                        {request.phone || "Телефон не указан"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {whatsAppUrl ? (
                        <a
                          href={whatsAppUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full bg-green-600 px-5 py-3 text-sm text-white"
                        >
                          WhatsApp
                        </a>
                      ) : (
                        <button
                          disabled
                          className="cursor-not-allowed rounded-full bg-neutral-200 px-5 py-3 text-sm text-neutral-400"
                        >
                          WhatsApp
                        </button>
                      )}

                      <button
                        onClick={() => copyRequest(request)}
                        className="rounded-full border border-neutral-300 px-5 py-3 text-sm"
                      >
                        {copiedId === request.id
                          ? "Скопировано"
                          : "Скопировать"}
                      </button>

                      <button
                        onClick={() => deleteRequest(request.id)}
                        className="rounded-full border border-red-200 px-5 py-3 text-sm text-red-600"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>

                  <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <InfoCard label="Повод" value={request.concern} />
                    <InfoCard label="Срочность" value={request.urgency} />
                    <InfoCard label="Боль" value={request.pain} />
                    <InfoCard
                      label="Удобное время"
                      value={request.preferredTime}
                    />
                  </div>

                  {request.comment && (
                    <div className="mb-6 rounded-2xl bg-[#F7F6F3] p-5">
                      <p className="mb-2 text-xs uppercase tracking-[0.25em] text-neutral-400">
                        Комментарий
                      </p>
                      <p className="leading-7">{request.comment}</p>
                    </div>
                  )}

                  {request.recommendation && (
                    <div className="mb-6 rounded-2xl bg-[#151515] p-5 text-white">
                      <p className="mb-2 text-xs uppercase tracking-[0.25em] text-neutral-400">
                        AI-рекомендация
                      </p>
                      <p className="leading-7 text-neutral-200">
                        {request.recommendation}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col gap-3 border-t border-neutral-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-neutral-500">
                      Статус обработки заявки
                    </p>

                    <select
                      value={request.status || "new"}
                      onChange={(event) =>
                        updateStatus(request.id, event.target.value)
                      }
                      className="rounded-full border border-neutral-200 bg-[#F7F6F3] px-5 py-3 text-sm outline-none focus:border-[#151515]"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-[#F7F6F3] p-5">
      <p className="mb-2 text-xs uppercase tracking-[0.25em] text-neutral-400">
        {label}
      </p>

      <p className="leading-7">{value || "-"}</p>
    </div>
  );
}