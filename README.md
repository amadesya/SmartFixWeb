![.NET Core](https://img.shields.io/badge/.NET%208-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
# SmartFix — CRM/ERP-система для сервисного центра

Веб-приложение для автоматизации работы сервисного центра по ремонту техники: управление заявками, учет клиентов, каталог услуг, авторизация и уведомления.

**Демо приложения:** [https://smartfix.amadesu.space](https://smartfix.amadesu.space)

## Скриншоты приложения

|<img width="100%" alt="Price list" src="https://github.com/user-attachments/assets/56348603-4321-44bc-93a8-672399918360" /> | <img width="100%" alt="Admin Dashboard" src="https://github.com/user-attachments/assets/25ebee77-fddf-4f3f-9c9e-674ccc075874" /> |
|:---:|:---:|
| **Каталог услуг и витрина** | **Панель управления и заявки** |

## Технологический стек

- **Backend:** C# / .NET 8, ASP.NET Core Web API, Entity Framework Core, LINQ
- **Frontend:** React, TypeScript, Tailwind CSS, Vite
- **Database:** MySQL 8.0
- **DevOps & Infrastructure:** Docker, Docker Compose, Nginx (Reverse Proxy), Certbot (SSL/HTTPS)
- **CI/CD:** GitHub Actions (автоматический деплой на VDS по SSH)
- **Интеграции:** Telegram Bot API (фоновые сервисы уведомлений)

## Архитектура

- **REST API & Безопасность:** Авторизация на базе JWT-токенов, ролевая модель доступа.
- **База данных:** Реляционная структура MySQL с EF Core миграциями и скриптами инициализации (`init.sql`).
- **Контейнеризация:** Изолированный запуск всех сервисов (Backend, Frontend, Database) через Docker Compose.
- **Reverse Proxy & HTTPS:** Маршрутизация запросов и защита трафика с помощью Nginx и SSL-сертификатов Let's Encrypt.
- **Автоматизация:** Настроен CI/CD pipeline в GitHub Actions для сборки и автоматического перезапуска контейнеров на production-сервере.

## Локальный запуск

### Предварительные требования
- Docker Desktop и Docker Compose

## Запуск проекта
### 1. Клонируйте репозиторий:
   ```bash
   git clone [https://github.com/твое_имя/SmartFixWeb.git](https://github.com/твое_имя/SmartFixWeb.git)
   cd SmartFixWeb
   ```

### 2. Создайте файл .env в корне проекта на основе .env.example:
```bash
DB_NAME=smartfix
DB_USER=smartfix_user
DB_PASSWORD=your_password
DB_ROOT_PASSWORD=your_root_password
JWT_SECRET_KEY=your_super_secret_jwt_key
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

### 3. Запустите контейнеры: 
```bash
docker compose up -d --build
```
Приложение будет доступно по адресам:
Frontend: http://localhost:3000
Backend API: http://localhost:8080

Структура проекта
```
SmartFixWeb/
├── .github/workflows/   # Скрипты автоматического деплоя (CI/CD)
├── backend/             # Исходный код ASP.NET Core Web API
├── backend.tests/       # Юнит- и интеграционные тесты
├── frontend/            # Исходный код React / TypeScript
├── scripts/             # SQL-скрипты инициализации БД
└── docker-compose.yml   # Конфигурация Docker-сервисов
```

### 4. Проверить `.gitignore`

Убедись, что в репозиторий **не попадают**:
* Файлы `.env` с реальными паролями и ключами.
* Папки `bin/`, `obj/`, `node_modules/`.
* Локальные сборки и кэши.
