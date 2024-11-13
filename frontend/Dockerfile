FROM node:16

# DIRECTORIO DE TRABAJO
WORKDIR /app

COPY . .

# INSTALAR DEPENDENCIAS
RUN npm install

# RUN
RUN npm run build

# PORT 8000
EXPOSE 8000

# EJECUTAR
CMD ["npm", "run", "serve"]