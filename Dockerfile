# ---- Etapa 1: build de producción ----
FROM node:24-alpine AS build

WORKDIR /app

# Instalar dependencias primero para aprovechar la caché de capas
COPY package.json package-lock.json ./
RUN npm ci

# Copiar el código y compilar la configuración indicada por BUILD_ENV
COPY . .

# Configuración de Angular a compilar.
# Sobrescribible en build: docker build --build-arg BUILD_ENV=production .
ARG BUILD_ENV=development
ENV BUILD_ENV=$BUILD_ENV
RUN npx ng build --configuration "$BUILD_ENV"

# ---- Etapa 2: servidor estático con nginx ----
FROM nginx:1.31-alpine AS runtime

# Configuración de nginx (SPA + gzip + caché)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar solo el artefacto estático del build
COPY --from=build /app/dist/teletubbies-course-ui-example/browser /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
