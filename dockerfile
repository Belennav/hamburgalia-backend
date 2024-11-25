# Imagen base de Node.js
FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos del proyecto
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos
COPY . .

# Exponer el puerto en el que el backend escuchará
EXPOSE 3000

# Comando para ejecutar el backend
CMD ["npm", "start"]
