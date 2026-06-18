
export default function Home() {

  const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

  const services = [
    ["Профилактика", "Профессиональная чистка, осмотр и рекомендации по уходу."],
    ["Лечение кариеса", "Аккуратное восстановление зубов с понятным планом лечения."],
    ["Эндодонтия", "Лечение каналов с фокусом на сохранение зуба."],
    ["Эстетика", "Реставрации, отбеливание и улучшение эстетики улыбки."],
    ["Ортодонтия", "Исправление прикуса и выравнивание зубов."],
    ["Имплантация", "Восстановление отсутствующих зубов современными методами."],
  ];

  const prices = [
    ["Консультация", "от 10 000 ₸"],
    ["Профессиональная чистка", "от 30 000 ₸"],
    ["Лечение кариеса", "от 25 000 ₸"],
    ["Лечение каналов", "от 45 000 ₸"],
    ["Эстетическая реставрация", "от 35 000 ₸"],
    ["Имплантация", "от 250 000 ₸"],
  ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F7F6F3] text-[#2D2D2D]">
      <header className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8 sm:py-8">
        <a href="#" className="shrink-0">
          <img
            src={`${BASE_PATH}/logo.png`}
            alt="ALADENT"
            className="h-14 w-auto sm:h-20 md:h-24"
          />
        </a>

        <nav className="hidden items-center gap-8 text-sm text-neutral-600 lg:flex">
          <a href="#about">О нас</a>
          <a href="#services">Услуги</a>
          <a href="#prices">Цены</a>
          <a href="#ai">AI-консультация</a>
          <a href="#contacts">Контакты</a>
        </nav>

        <div className="hidden gap-2 text-sm md:flex">
          <button className="font-medium">RU</button>
          <span className="text-neutral-400">/</span>
          <button className="text-neutral-400">KZ</button>
        </div>

        <a
          href="#contacts"
          className="rounded-full bg-[#151515] px-5 py-3 text-sm text-white sm:px-7 sm:py-4 sm:text-base"
        >
          Записаться
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
          ALADENT • Алматы
        </p>

        <h1 className="mb-8 max-w-5xl text-5xl font-extralight leading-[1.05] sm:text-6xl md:text-8xl">
          Эстетика.
          <br />
          Точность.
          <br />
          Забота.
        </h1>

        <p className="mb-10 max-w-2xl text-lg leading-8 text-neutral-600 sm:text-xl sm:leading-9">
          Современная стоматология в Алматы: диагностика, лечение и эстетика
          улыбки с прозрачным подходом к каждому этапу.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <a
            href="#contacts"
            className="rounded-full bg-[#151515] px-8 py-4 text-center text-white sm:px-9 sm:py-5"
          >
            Записаться на прием
          </a>

          <a
            href="/consultation"
            className="rounded-full border border-neutral-300 px-8 py-4 text-center sm:px-9 sm:py-5"
          >
            AI-консультация
          </a>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="mb-10 max-w-2xl sm:mb-12">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-neutral-500 sm:text-sm">
            Подход
          </p>

          <h2 className="text-3xl font-light sm:text-4xl md:text-5xl">
            Лечение, в котором понятен каждый шаг
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Диагностика", "Начинаем с причины, а не с быстрой процедуры."],
            ["Прозрачность", "Объясняем варианты лечения и стоимость заранее."],
            ["Комфорт", "Бережный прием, современная анестезия и спокойная атмосфера."],
            ["Сопровождение", "Остаемся на связи после визита и напоминаем о дальнейшем уходе."],
          ].map(([title, text]) => (
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

      <section id="services" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-neutral-500 sm:text-sm">
              Услуги
            </p>
            <h2 className="text-3xl font-light sm:text-4xl md:text-5xl">
              Основные направления
            </h2>
          </div>

          <p className="max-w-xl leading-7 text-neutral-600">
            Мы не перегружаем пациента лишними процедурами. Сначала диагностика,
            затем понятный план лечения.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(([title, text]) => (
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

      <section id="prices" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-neutral-500 sm:text-sm">
              Цены
            </p>

            <h2 className="mb-6 text-3xl font-light sm:text-4xl md:text-5xl">
              Прозрачная ценовая политика
            </h2>

            <p className="leading-8 text-neutral-600">
              Финальная стоимость зависит от диагностики и объема лечения.
              Мы заранее объясняем варианты и согласовываем план.
            </p>
          </div>

          <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
            {prices.map(([service, price]) => (
              <div
                key={service}
                className="flex flex-col gap-2 border-b border-neutral-100 px-6 py-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6"
              >
                <span className="text-base sm:text-lg">{service}</span>
                <span className="text-base font-medium sm:text-lg">{price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="ai" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#151515] p-8 text-white sm:rounded-[3rem] sm:p-12 md:p-16">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" />
          <div className="absolute -bottom-24 right-24 h-72 w-72 rounded-full border border-white/10" />

          <div className="relative z-10 max-w-3xl">
            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-neutral-400 sm:text-sm">
              AI-консультация
            </p>

            <h2 className="mb-6 text-3xl font-light sm:text-4xl md:text-6xl">
              Быстрый первичный опрос перед визитом
            </h2>

            <p className="mb-10 text-lg leading-8 text-neutral-300">
              Ответьте на несколько вопросов. AI-помощник соберет информацию и
              подготовит заявку для администратора.
            </p>

            <a
              href="/consultation"
              className="inline-flex w-full items-center justify-center rounded-full bg-white px-8 py-5 text-center text-lg text-[#151515] sm:w-auto sm:px-12 sm:py-6"
            >
              Начать консультацию
            </a>
          </div>
        </div>
      </section>

      <section id="contacts" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-10 rounded-[2rem] bg-white p-7 shadow-sm sm:rounded-[3rem] sm:p-10 md:grid-cols-2 md:p-16">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-neutral-500 sm:text-sm">
              Контакты
            </p>

            <h2 className="mb-6 text-3xl font-light sm:text-4xl md:text-5xl">
              Запишитесь на прием
            </h2>

            <p className="mb-8 leading-8 text-neutral-600">
              Оставьте заявку, и администратор свяжется с вами для уточнения
              времени и причины обращения.
            </p>

            <div className="space-y-4 text-base sm:text-lg">
              <p>📍 Алматы</p>
              <p>📞 +7 XXX XXX XX XX</p>
              <p>💬 WhatsApp</p>
              <p>🕘 Пн–Сб: 09:00–19:00</p>
            </div>
          </div>

          <form className="space-y-4">
            <input
              className="w-full rounded-2xl border border-neutral-200 bg-[#F7F6F3] px-5 py-4 outline-none"
              placeholder="Ваше имя"
            />

            <input
              className="w-full rounded-2xl border border-neutral-200 bg-[#F7F6F3] px-5 py-4 outline-none"
              placeholder="Телефон"
            />

            <textarea
              className="h-32 w-full rounded-2xl border border-neutral-200 bg-[#F7F6F3] px-5 py-4 outline-none"
              placeholder="Что вас беспокоит?"
            />

            <button className="w-full rounded-full bg-[#151515] px-8 py-5 text-white">
              Отправить заявку
            </button>

            <p className="text-sm leading-6 text-neutral-500">
              Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
            </p>
          </form>
        </div>
      </section>

      <footer className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12">
        <div className="flex flex-col justify-between gap-6 border-t border-neutral-200 pt-8 md:flex-row md:items-center">
          <div>
            <img src={`${BASE_PATH}/logo.png`} alt="ALADENT" className="mb-4 h-14 w-auto sm:h-16" />
            <p className="text-neutral-500">
              Smiles majestic as the Almaty peaks
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-sm text-neutral-500 sm:gap-6">
            <a href="#services">Услуги</a>
            <a href="#prices">Цены</a>
            <a href="#contacts">Контакты</a>
            <a href="/consultation">AI-консультация</a>
          </div>
        </div>
      </footer>
    </main>
  );
}