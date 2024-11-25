# Usa una imagen oficial de Node.js como base
FROM node:18

# Setea el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos de configuración
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el código fuente del backend
COPY . .

# Exponer el puerto que el backend va a utilizar (Ejemplo: 3000)
EXPOSE 3000

# Comando para ejecutar la app de Node.js
CMD ["npm", "start"]
