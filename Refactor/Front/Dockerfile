FROM node:22-alpine AS build
WORKDIR /app

# Кэшируем установку зависимостей
COPY package*.json ./
# Устанавливаем ВСЕ зависимости (включая devDependencies для сборки Tailwind)
RUN npm ci

# Копируем исходный код
COPY . .

# Собираем production-бандл (Vite обработает Tailwind корректно)
ENV NODE_OPTIONS="--max-old-space-size=1536"
RUN npm run build

# Этап раздачи статики через Nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
