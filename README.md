# Детский театр «алёнка» — Ставрополь

Готовый к деплою статический сайт на Astro 5.x с Tailwind CSS. Оптимизирован для SEO, производительности и конверсии.

## Быстрый старт

1. Установка зависимостей

```bash
npm run setup
# если не сработало, используйте:
# npm install
```

2. Запуск в разработке

```bash
npm run dev
```

3. Сборка и предпросмотр

```bash
npm run build
npm run preview
```

Развёртывание: Vercel, Netlify, Cloudflare Pages.

## Технологии

- Astro 5.x (Static Site Generation, islands)
- Tailwind CSS
- Content Collections (услуги, блог)
- Sitemap

## Контент и коллекции

- Услуги: src/content/services/*.md — порядок вывода через поле `order`.
- Блог: src/content/blog/*.md

Схемы коллекций описаны в src/content/config.ts.

## Страницы

- Главная: / (Hero, Services, About, Contact)
- Услуги: /services/[slug]
- О нас: /about
- Контакты: /contact
- Блог: /blog/[slug]

## Компоненты и секции

- Layout: src/layouts/BaseLayout.astro — SEO-мета, JSON-LD, Header/Footer
- Header/Footer: навигация, контакты
- Секции: Hero, Services, About, Contact

## Дизайн

- Стиль: modern — яркие цвета, крупная типографика, плавные ховеры
- Цвета бренда (tailwind.config.mjs):
  - primary: #E11D48
  - secondary: #06B6D4
  - accent: #F59E0B

## Плейсхолдеры

- {{business_name}}: алёнка
- {{location}}: Ставрополь
- {{phone}}: +7 (8652) 55-44-33
- {{email}}: hello@alyonka-teatr-stavropol.ru
- {{hero_headline}}: Детский театр «алёнка» — праздники в Ставрополе
- {{hero_subheadline}}: Очень дружелюбные и опытные актёры...
- {{hero_cta_text}}: Записаться
- {{service_N_title}}: Театр для детей / Организация праздников / Аниматоры
- {{service_N_description}}: Одно-предложение 100–150 символов

Правила:
- Заголовок Hero: 40–60 знаков, с локацией и главным ключом
- Подзаголовок Hero: 80–120 знаков, выгоды/УТП
- Описания услуг: 100–150 знаков

## SEO и доступность

- Динамические title/description, canonical, OG/Twitter
- JSON-LD LocalBusiness на каждой странице
- Семантическая разметка: header/main/section/article/footer/nav
- Lighthouse >90 (изображения — webp, ленивая загрузка, минимальный JS)
- Контраст, фокусные состояния, управление с клавиатуры

## Настройка

- Измените данные компании в страницах и компонентах (телефон, email, адрес)
- Добавьте контент в `src/content/services/` и `src/content/blog/`
- Обновите `site` в astro.config.mjs для корректной sitemap/robots.txt

## Лицензия

MIT
