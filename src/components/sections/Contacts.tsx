export default function Contacts() {
  return (
    <section className="contact-section" id="contacts" aria-labelledby="contact-title">
      <div className="container">
        <div className="contact-section__inner">
          <div className="contact-section__content">
            <p className="eyebrow">КОНТАКТЫ</p>

            <h2 id="contact-title">Давайте обсудим ваш проект</h2>

            <p className="contact-section__description">
              Подберём готовый комплект защиты для вашего автомобиля или обсудим индивидуальное
              изготовление. Ответим на вопросы и поможем определиться с решением.
            </p>

            <div className="contact-section__coverage">
              <span className="contact-section__coverage-icon">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 21S19 14.8 19 9.5A7 7 0 1 0 5 9.5C5 14.8 12 21 12 21Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </span>

              <div>
                <strong>Работаем по всей России</strong>
                <p>Доставка готовых комплектов в ваш регион</p>
              </div>
            </div>
          </div>

          <div className="contact-section__cards">
            <div className="contact-section__card">
              <span>ТЕЛЕФОН</span>
              <strong>+7 (000) 000-00-00</strong>
              <p>Связь по вопросам продукции и изготовления</p>
            </div>

            <div className="contact-section__card">
              <span>ЭЛЕКТРОННАЯ ПОЧТА</span>
              <strong>info@example.com</strong>
              <p>Для вопросов и обсуждения индивидуальных проектов</p>
            </div>

            <div className="contact-section__note">
              GRANFORT <span> / </span> OFF-ROAD EQUIPMENT
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
