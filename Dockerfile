# ============================================================
# Mesa Lúdica - Imagen Docker (build Angular + Nginx)
# DSY2202 - Experiencia 3, Semana 8
#
# Construcción en dos etapas (multi-stage):
#   1) Node compila la aplicación Angular a estáticos.
#   2) Nginx sirve esos estáticos en el puerto 80.
# ============================================================

# ----- Etapa 1: compilación de la aplicación Angular -----
FROM node:22-alpine AS build
WORKDIR /app

# Instala dependencias a partir del lockfile (build reproducible)
COPY package.json package-lock.json ./
RUN npm ci

# Copia el código fuente y genera el build de producción
COPY . .
RUN npm run build

# ----- Etapa 2: servir los estáticos con Nginx -----
FROM nginx:alpine AS prod

# Configuración de Nginx con fallback para las rutas de la SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia el resultado del build de Angular al directorio público de Nginx.
# Angular 20 genera la carpeta browser dentro de dist/<nombre-proyecto>/.
COPY --from=build /app/dist/mesa-ludica/browser/ /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
