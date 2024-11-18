FROM node:16

# DIRECTORIO DE TRABAJO
WORKDIR /app

COPY . .

# INSTALAR DEPENDENCIAS
RUN npm install

# COPIAR EL ARCHIVO SQL Y EL SCRIPT DE EJECUCIÓN
COPY ./docs/insert-movies.sql /app/scripts/
COPY docs/init-movies.js /app/scripts/

# EXPONER PUERTO
EXPOSE 3000

# COMANDO DE INICIO
CMD sh -c "npm run dev & sleep 5 && node /app/scripts/init-movies.js && wait"