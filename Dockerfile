FROM node:20-alpine AS builder

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de definición de dependencias
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia todo el código fuente al contenedor
COPY . .

# Construye la aplicación Vite para producción
RUN npm run build

# Imagen final ligera para servir los archivos estáticos
FROM node:20-alpine

WORKDIR /app

# Copia el build desde la etapa anterior
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Instala solo serve para producción (servidor estático)
RUN npm install -g serve

# Define el puerto
ENV PORT=4001

# Expone el puerto
EXPOSE 4001

# Sirve la aplicación estática en el puerto 4001
CMD ["serve", "-s", "dist", "-l", "4001"]
