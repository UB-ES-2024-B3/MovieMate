FROM node:16

# DIRECTORIO DE TRABAJO
WORKDIR /app

COPY . .


# COPIAR EL ARCHIVO SQL Y EL SCRIPT DE EJECUCIÓN
COPY ./docs/insert-movies.sql /app/scripts/
COPY ./docs/init-movies.js /app/scripts/
COPY ./docs/start.sh /app/start.sh

# INSTALAR DEPENDENCIAS
RUN npm install

RUN chmod +x /app/start.sh

# EXPONER PUERTO
EXPOSE 3000

# COMANDO DE INICIO
CMD ["sh", "/app/start.sh"]