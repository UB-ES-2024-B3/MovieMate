FROM node:16

# DIRECTORIO DE TRABAJO
WORKDIR /app

COPY . .

# INSTALAR DEPENDENCIAS
RUN npm install

COPY .env .env

# PORT 8000
EXPOSE 8000

# EJECUTAR
CMD ["npm", "run", "serve", "--", "--host", "0.0.0.0", "--port", "8000"]