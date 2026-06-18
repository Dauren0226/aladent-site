"use client";

import { useEffect, useMemo, useState } from "react";

import { BASE_PATH } from "../../lib/paths";

const statuses = [
  "Новая",
  "Связаться",
  "Записан",
  "Пришел",
  "Завершен",
  "Потерян",
];

export default function AdminPage() {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("Все");

  useEffect(() => {
    const savedRequests = JSON.parse(
      localStorage.getItem("aladent_requests") || "[]"
    );

    setRequests(savedRequests);
  }, []);

  const filteredRequests = useMemo(() => {
    if (statusFilter === "Все") {
      return requests;
    }

    return requests.filter((request) => request.status === statusFilter);
  }, [requests, statusFilter]);

  const saveRequests = (updatedRequests) => {
    setRequests(updatedRequests);
    localStorage.setItem("aladent_requests", JSON.stringify(updatedRequests));
  };

  const updateStatus = (id, newStatus) => {
    const updatedRequests = requests.map((request) => {
      if (request.id === id) {
        return {
          ...request,
          status: newStatus,
        };
      }

      return request;
    });

    saveRequests(updatedRequests);
  };

  const deleteRequest = (id) => {
    const updatedRequests = requests.filter((request) => request.id !== id);
    saveRequests(updatedRequests);
  };

  const clearAllRequests = () => {
    const confirmed = window.confirm("Удалить все заявки из локальной CRM?");

    if (confirmed) {
      saveRequests([]);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="min-h-screen bg-[#F7F6F3] px-5 py-8 text-[#2D2D2D] sm:px-8">
      <header className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <a href={`${BASE_PATH}/`}>
          <img src={`${BASE_PATH}/logo.png`} alt="ALADENT" className="h-14 w-auto sm:h-16" />
        </a>

        <div className="flex gap-2">
          <a
            href={`${BASE_PATH}/ai-chat/`}
            className="rounded-full border border-neutral-300 px-5 py-3 text-sm"
          >
            Новая заявка
          </a>

          <a
            href={`${BASE_PATH}/`}
            className="rounded-full border border-neutral-300 px-5 py-3 text-sm"
          >
            На главную
          </a>
        </div>
      </header>

      <section className="mx-auto mt-10 max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-neutral-500 sm:text-sm">
              ALADENT CRM
            </p>

            <h1 className="text-4xl font-light sm:text-6xl">
              Заявки пациентов
            </h1>
          </div>

          <div className="rounded-2xl bg-white px-6 py-4 shadow-sm">
            <p className="text-sm text-neutral-500">Всего заявок</p>
            <p className="text-3xl font-light">{requests.length}</p>
          </div>
        </div>

        <div className="mb-8 flex flex-col gap-4 rounded-[2rem] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {["Все", ...statuses].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-full px-5 py-3 text-sm ${
                  statusFilter === status
                    ? "bg-[#151515] text-white"
                    : "bg-[#F7F6F3] text-neutral-700"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <button
            onClick={clearAllRequests}
            className="rounded-full border border-red-200 px-5 py-3 text-sm text-red-600"
          >
            Очистить CRM
          </button>
        </div>

        {filteredRequests.length === 0 && (
          <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm">
            <h2 className="mb-3 text-2xl font-light">Заявок пока нет</h2>
            <p className="mb-8 text-neutral-600">
              Пройдите AI-опрос, чтобы создать первую заявку.
            </p>

            <a
              href={`${BASE_PATH}/ai-chat/`}
              className="inline-flex rounded-full bg-[#151515] px-8 py-4 text-white"
            >
              Создать заявку
            </a>
          </div>
        )}

        {filteredRequests.length > 0 && (
          <div className="grid gap-5">
            {filteredRequests.map((request) => (
              <article
                key={request.id}
                className="rounded-[2rem] bg-white p-6 shadow-sm"
              >
                <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-light">{request.name}</h2>

                      <span className="rounded-full bg-[#F7F6F3] px-4 py-2 text-sm">
                        {request.status}
                      </span>
                    </div>

                    <p className="text-neutral-500">
                      Создано: {formatDate(request.createdAt)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <select
                      value={request.status}
                      onChange={(event) =>
                        updateStatus(request.id, event.target.value)
                      }
                      className="rounded-full border border-neutral-200 bg-white px-5 py-3 outline-none"
                    >
                      {statuses.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>

                    <button
                      onClick={() => deleteRequest(request.id)}
                      className="rounded-full border border-red-200 px-5 py-3 text-red-600"
                    >
                      Удалить
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <InfoCard title="Телефон" value={request.phone} />
                  <InfoCard title="Причина" value={request.concern} />
                  <InfoCard title="Срочность" value={request.urgency} />
                  <InfoCard title="Боль" value={request.pain} />
                  <InfoCard title="Удобное время" value={request.preferredTime} />
                  <InfoCard title="Комментарий" value={request.comment || "—"} />
                </div>

                <div className="mt-5 rounded-2xl bg-[#F7F6F3] p-5">
                  <p className="mb-2 text-sm uppercase tracking-[0.25em] text-neutral-400">
                    Рекомендация системы
                  </p>
                  <p className="leading-7">{request.recommendation}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function InfoCard({ title, value }) {
  return (
    <div className="rounded-2xl bg-[#F7F6F3] p-5">
      <p className="mb-2 text-sm uppercase tracking-[0.25em] text-neutral-400">
        {title}
      </p>
      <p className="leading-7">{value}</p>
    </div>
  );
}