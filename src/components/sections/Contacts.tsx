export default function Contacts() {
  return (
    <section
      id="contacts"
      aria-labelledby="contact-title"
      className="bg-night-elevated text-on-dark relative isolate overflow-hidden py-[110px] max-[900px]:py-[85px] max-[600px]:py-[70px]"
    >
      <div
        aria-hidden="true"
        className="border-on-dark/[0.06] pointer-events-none absolute -top-[220px] -right-[150px] size-[550px] rounded-full border"
      />

      <div className="max-w-site relative z-10 mx-auto w-[calc(100%_-_4rem)] max-[560px]:w-[calc(100%_-_36px)]">
        <div className="grid grid-cols-[1fr_0.8fr] items-center gap-[90px] max-[900px]:grid-cols-1 max-[900px]:gap-[50px]">
          <div>
            <p className="text-caption text-brand-highlight font-extrabold tracking-[0.15em] uppercase">
              Контакты
            </p>

            <h2
              id="contact-title"
              className="mt-5 mb-[22px] max-w-[570px] text-[clamp(36px,4.5vw,56px)] leading-[1.08] font-bold tracking-[-0.04em]"
            >
              Давайте обсудим ваш проект
            </h2>

            <p className="text-on-dark/65 max-w-[500px] text-[15px] leading-[1.8]">
              Подберём готовый комплект защиты для вашего автомобиля или обсудим индивидуальное
              изготовление. Ответим на вопросы и поможем определиться с решением.
            </p>

            <div className="mt-[42px] flex items-center gap-4 max-[600px]:mt-8">
              <span className="border-on-dark/[0.15] flex size-12 shrink-0 items-center justify-center border">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-[23px]">
                  <path
                    d="M12 21S19 14.8 19 9.5A7 7 0 1 0 5 9.5C5 14.8 12 21 12 21Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </span>

              <div>
                <strong className="mb-[5px] block text-sm font-semibold">
                  Работаем по всей России
                </strong>

                <p className="text-on-dark-muted text-xs">
                  Доставка готовых комплектов в ваш регион
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-[14px]">
            <div className="border-on-dark/[0.12] bg-on-dark/[0.035] hover:border-brand-highlight/60 hover:bg-on-dark/[0.055] border p-7 transition-colors duration-300 max-[600px]:p-[23px]">
              <span className="text-brand-highlight mb-4 block text-[10px] font-bold tracking-[0.14em]">
                ТЕЛЕФОН
              </span>

              <strong className="block text-[19px] font-medium max-[600px]:text-[17px]">
                +7 (000) 000-00-00
              </strong>

              <p className="text-on-dark-muted mt-[9px] text-xs leading-[1.6]">
                Связь по вопросам продукции и изготовления
              </p>
            </div>

            <div className="border-on-dark/[0.12] bg-on-dark/[0.035] hover:border-brand-highlight/60 hover:bg-on-dark/[0.055] border p-7 transition-colors duration-300 max-[600px]:p-[23px]">
              <span className="text-brand-highlight mb-4 block text-[10px] font-bold tracking-[0.14em]">
                ЭЛЕКТРОННАЯ ПОЧТА
              </span>

              <strong className="block text-[19px] font-medium max-[600px]:text-[17px]">
                info@example.com
              </strong>

              <p className="text-on-dark-muted mt-[9px] text-xs leading-[1.6]">
                Для вопросов и обсуждения индивидуальных проектов
              </p>
            </div>

            <div className="text-on-dark/45 mt-3 text-[10px] font-semibold tracking-[0.15em]">
              GRANFORT <span className="text-brand-highlight">/</span> OFF-ROAD EQUIPMENT
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
