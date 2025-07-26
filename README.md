# Персональный сайт-портфолио

Это репозиторий моего персонального веб-сайта ([diametrfq.ru](https://diametrfq.ru)), разработанного как full-stack приложение в монорепозитории. Проект включает в себя современный фронтенд на Next.js, производительный бэкенд на Rust (Actix Web) и полностью автоматизированную CI/CD-инфраструктуру на базе Docker и GitHub Actions.

**➡️ [Посмотреть вживую](https://diametrfq.ru)**

## ✨ Ключевые особенности

### Фронтенд:
*   **Интернационализация (i18n):** Полная поддержка русского и английского языков с помощью `next-intl`.
*   **Spotify "Сейчас играет":** Динамический виджет, который в реальном времени показывает трек, который я слушаю в Spotify, используя Server-Sent Events (SSE).
*   **Лента Telegram:** Автоматически загружает и отображает последние посты из моего Telegram-канала.
*   **Интерактивность:** Плавные анимации и интерактивные элементы для улучшения пользовательского опыта.

### Бэкенд:
*   **Интеграция со Spotify:** Реализован полный цикл OAuth 2.0 для обновления токенов и получения данных из Spotify API. Включает логику для определения прослушивания на основе уровня громкости.
*   **Интеграция с Telegram:** Парсит RSS-ленту Telegram-канала для получения постов, извлекая текст, ссылки и изображения.
*   **Метрики для мониторинга:** Предоставляет эндпоинт `/metrics` для сбора данных системой мониторинга Prometheus.

### Инфраструктура и DevOps:
*   **Полная контейнеризация:** Весь проект (фронтенд, бэкенд, Nginx, сервисы мониторинга) упакован в Docker-контейнеры.
*   **CI/CD Автоматизация:** Настроенный пайплайн в GitHub Actions, который при Pull Request в ветку `main` автоматически:
    1.  Собирает production-образы фронтенда и бэкенда.
    2.  Пушит образы в Docker Hub.
    3.  Подключается к серверу по SSH.
    4.  Загружает актуальный `docker-compose.yml` и конфигурации.
    5.  Перезапускает все сервисы с новыми образами.
*   **Мониторинг и Логирование:** Интегрирован стек Prometheus + Grafana + Loki для сбора метрик, мониторинга состояния контейнеров и централизованного сбора логов.
*   **Nginx Reverse Proxy:** Настроен для обработки SSL-сертификатов, перенаправления трафика на Next.js и проксирования запросов к Grafana.

## 🛠️ Технологический стек

| Категория       | Технология                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------- |
| **Фронтенд**    | [Next.js](https://nextjs.org/), [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/), [next-intl](https://next-intl.dev/) |
| **Бэкенд**      | [Rust](https://www.rust-lang.org/), [Actix Web](https://actix.rs/), [Tokio](https://tokio.rs/), [Serde](https://serde.rs/), [Reqwest](https://github.com/seanmonstar/reqwest) |
| **Базы данных** | Не используются (данные запрашиваются из внешних API в реальном времени)                                     |
| **DevOps**      | [Docker](https://www.docker.com/), [Docker Compose](https://docs.docker.com/compose/), [Nginx](https://www.nginx.com/), [GitHub Actions](https://github.com/features/actions) |
| **Мониторинг**  | [Prometheus](https://prometheus.io/), [Grafana](https://grafana.com/), [Loki](https://grafana.com/oss/loki/), [Promtail](https://grafana.com/docs/loki/latest/clients/promtail/), [cAdvisor](https://github.com/google/cadvisor) |
