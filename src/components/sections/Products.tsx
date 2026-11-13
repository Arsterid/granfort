import { productMaterials, products } from "@/data/products";
import { assetPath } from "@/lib/assetPath";
import Image from "next/image";

export default function Products() {
  return (
    <section className="products" id="products" aria-labelledby="products-title">
      <div className="container">
        <div className="products__heading">
          <div>
            <div className="eyebrow">
              <span className="eyebrow__line" />
              Наша продукция
            </div>

            <h2 id="products-title">
              Готовые решения для <span>вашего автомобиля.</span>
            </h2>
          </div>

          <p>
            Разрабатываем защиту с учётом особенностей конкретной модели. Сейчас в линейке — два
            готовых комплекта для популярных внедорожников и пикапов.
          </p>
        </div>

        <div className="products__grid">
          {products.map((product, index) => {
            const image =
              product.vehicleType === "pickup" ? "/images/jac-t9.png" : "/images/haval-h3.png";

            return (
              <article className="product-card" key={product.id}>
                <div className="product-card__visual">
                  <div className="product-card__visual-top">
                    <span>{product.code}</span>
                    <span>READY SOLUTION</span>
                  </div>

                  <div className="product-card__model-bg">{product.model}</div>

                  <div className="product-card__image-stage">
                    <Image
                      src={assetPath(image)}
                      alt={product.model}
                      fill
                      sizes="(max-width: 900px) 100vw, 50vw"
                      unoptimized
                      className="product-card__artwork"
                    />
                  </div>

                  <div className="product-card__visual-bottom">
                    <span>{product.category}</span>
                    <span>0{index + 1} / 02</span>
                  </div>
                </div>

                <div className="product-card__content">
                  <div className="product-card__title-row">
                    <div>
                      <span className="product-card__label">ГОТОВЫЙ КОМПЛЕКТ</span>

                      <h3>{product.model}</h3>
                    </div>

                    <span className="product-card__index">0{index + 1}</span>
                  </div>

                  <p className="product-card__description">{product.description}</p>

                  <ul className="product-card__features">
                    {product.features.map((feature) => (
                      <li key={feature}>
                        <span aria-hidden="true">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <a href="#contacts" className="product-card__action">
                    <span>Запросить комплект</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        <div className="products__materials">
          <div className="products__materials-heading">
            <span>ВАРИАНТЫ ИСПОЛНЕНИЯ</span>
            <p>Подбирайте материал и внешний вид под свои задачи.</p>
          </div>

          <div className="products__materials-list">
            {productMaterials.map((material, index) => (
              <div className="products__material" key={material.name}>
                <span className="products__material-number">0{index + 1}</span>

                <div>
                  <strong>{material.name}</strong>
                  <span>{material.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
