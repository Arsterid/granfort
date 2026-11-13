export default function AdminPage() {
  return (
    <div>
      <div className="mb-8">
        <p className="text-brand text-xs font-bold tracking-[0.18em] uppercase">GRANFORT / ADMIN</p>

        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">Обзор</h1>

        <p className="mt-2 text-sm text-slate-500">
          Добро пожаловать в панель управления GRANFORT.
        </p>
      </div>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Каталог товаров</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Создание, редактирование и публикация товаров.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Автомобили</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Управление марками, моделями и поколениями автомобилей.
          </p>
        </div>
      </section>
    </div>
  );
}
