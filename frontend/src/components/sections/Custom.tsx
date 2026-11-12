export default function Custom() {
  return (
    <section className="custom-section" id="custom" aria-labelledby="custom-title">
      <div className="container">
        <div className="custom-section__main">
          <div className="custom-section__content">
            <p className="eyebrow">ИНДИВИДУАЛЬНОЕ ИЗГОТОВЛЕНИЕ</p>

            <h2 id="custom-title">Нужна защита для другой модели?</h2>

            <p className="custom-section__description">
              Разработаем комплект под ваш автомобиль и задачи. Обсудим конструкцию, материал и
              исполнение, чтобы защита гармонично сочеталась с автомобилем.
            </p>

            <div className="custom-section__features">
              <div className="custom-section__feature">
                <span>01</span>
                <p>Разработка для других марок и моделей</p>
              </div>

              <div className="custom-section__feature">
                <span>02</span>
                <p>Нержавеющая сталь AISI 304 или чёрный металл</p>
              </div>

              <div className="custom-section__feature">
                <span>03</span>
                <p>Выбор исполнения под ваши пожелания</p>
              </div>
            </div>

            <a href="#contacts" className="custom-section__button">
              Обсудить проект
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="custom-section__visual">
            <div className="custom-section__visual-top">
              <span>GRANFORT / CUSTOM</span>
              <span>GF — 03</span>
            </div>

            <div className="custom-section__illustration">
              <svg
                viewBox="0 0 520 300"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M65 174L94 126L149 101L370 101L426 130L458 174"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path d="M105 174H415L393 207H127L105 174Z" stroke="currentColor" strokeWidth="2" />
                <path d="M149 101L173 174M370 101L347 174" stroke="currentColor" strokeWidth="2" />
                <path d="M127 207L115 229H405L393 207" stroke="currentColor" strokeWidth="3" />
                <path d="M160 229V246M360 229V246" stroke="currentColor" strokeWidth="3" />
                <path d="M185 174V207M335 174V207" stroke="currentColor" strokeWidth="2" />
                <path d="M65 174H105M415 174H458" stroke="currentColor" strokeWidth="3" />
                <circle cx="65" cy="174" r="5" fill="currentColor" />
                <circle cx="458" cy="174" r="5" fill="currentColor" />
                <path
                  d="M260 101V174M245 101H275"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="5 6"
                />
                <path
                  d="M90 263H430"
                  stroke="currentColor"
                  strokeOpacity=".35"
                  strokeWidth="1"
                  strokeDasharray="4 7"
                />
              </svg>
            </div>

            <div className="custom-section__visual-caption">
              <span>ИНДИВИДУАЛЬНЫЙ ПРОЕКТ</span>
              <strong>От идеи — к готовому комплекту</strong>
            </div>
          </div>
        </div>

        <div className="custom-section__steps">
          <div className="custom-section__step">
            <span>01</span>
            <div>
              <h3>Обсуждаем задачу</h3>
              <p>Уточняем модель автомобиля и ваши пожелания</p>
            </div>
          </div>

          <div className="custom-section__step">
            <span>02</span>
            <div>
              <h3>Согласуем решение</h3>
              <p>Подбираем материал, конструкцию и исполнение</p>
            </div>
          </div>

          <div className="custom-section__step">
            <span>03</span>
            <div>
              <h3>Изготавливаем комплект</h3>
              <p>Переходим к реализации согласованного проекта</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
