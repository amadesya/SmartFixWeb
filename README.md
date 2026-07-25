# SmartFix — CRM/ERP-система для сервисного центра

Веб-приложение для автоматизации работы сервисного центра по ремонту техники: управление заявками, учет клиентов, каталог услуг, авторизация и уведомления.

**Демо приложения (Live):** [https://smartfix.amadesu.space](https://smartfix.amadesu.space)

---

## Технологический стек

- **Backend:** C# / .NET 8, ASP.NET Core Web API, Entity Framework Core, LINQ
- **Frontend:** React, TypeScript, Tailwind CSS, Vite
- **Database:** MySQL 8.0
- **DevOps & Infrastructure:** Docker, Docker Compose, Nginx (Reverse Proxy), Certbot (SSL/HTTPS)
- **CI/CD:** GitHub Actions (автоматический деплой на VDS по SSH)
- **Интеграции:** Telegram Bot API (фоновые сервисы уведомлений)

---

## Архитектура

- **REST API & Безопасность:** Авторизация на базе JWT-токенов, ролевая модель доступа.
- **База данных:** Реляционная структура MySQL с EF Core миграциями и скриптами инициализации (`init.sql`).
- **Контейнеризация:** Изолированный запуск всех сервисов (Backend, Frontend, Database) через Docker Compose.
- **Reverse Proxy & HTTPS:** Маршрутизация запросов и защита трафика с помощью Nginx и SSL-сертификатов Let's Encrypt.
- **Автоматизация:** Настроен CI/CD pipeline в GitHub Actions для сборки и автоматического перезапуска контейнеров на production-сервере.

---

## Локальный запуск

### Предварительные требования
- Docker Desktop и Docker Compose

### Запуск проекта
1. Клонируйте репозиторий:
   ```bash
   git clone [https://github.com/твое_имя/SmartFixWeb.git](https://github.com/твое_имя/SmartFixWeb.git)
   cd SmartFixWeb
   ```

2. Создайте файл .env в корне проекта на основе .env.example:
```DB_NAME=smartfix
DB_USER=smartfix_user
DB_PASSWORD=your_password
DB_ROOT_PASSWORD=your_root_password
JWT_SECRET_KEY=your_super_secret_jwt_key
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
Запустите контейнеры:
```

```Bash
docker compose up -d --build
```
Приложение будет доступно по адресам:

Frontend: http://localhost:3000

Backend API: http://localhost:8080

📂 Структура проекта
```
SmartFixWeb/
├── .github/workflows/   # Скрипты автоматического деплоя (CI/CD)
├── backend/             # Исходный код ASP.NET Core Web API
├── backend.tests/       # Юнит- и интеграционные тесты
├── frontend/            # Исходный код React / TypeScript
├── scripts/             # SQL-скрипты инициализации БД
└── docker-compose.yml   # Конфигурация Docker-сервисов
```
---

### 3. Проверить `.gitignore`

Убедись, что в репозиторий **не попадают**:
* Файлы `.env` с реальными паролями и ключами.
* Папки `bin/`, `obj/`, `node_modules/`.
* Локальные сборки и кэши.
