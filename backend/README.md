# Clean architecture ts-node-expres

Aplicación simple de ts-node-express con la posibilidad de escalar y añadir código de manera sencilla.

## Instalación

```bash
npm install
```

## Como levantar el servicio en local

```bash
npm run dev
```

## Como levantar el servicio para devops

```bash
npm run build
npm run start
```
## Como lanzar los test

Actualmente no hay test implementados ni una organización clara, poco a poco se irá modelando.

```bash
npm run test
```

## Como crear código

Para trabajar con esta aplicación tenemos una serie de carpetas:
- Main: donde se configura el servidor.
- Domain: para generar los modelos con sus validaciones.
- Application: para generar los servicios que actúan con los modelos.
- Infraestructure: para generar las capas de I/O, es decir controladores o queries a bases de datos.
- Interfaces: para generar interfices necesarias que no pertenecen a ningún modelo de dominio.
- Context: los famosos utils, separados de la aplicación (src), con el objetivo de productivizarse en una librería de haibu node lib.

## Variables de entorno

```sh
DB_HOST=localhost;DB_NAME=es-b3-database;DB_PASSWORD=prueba;DB_PORT=5432;DB_USERNAME=postgres;HOST=localhost;PORT=3000
```

## Contribución

Las pull requests son bienvenidas. Para grandes cambios, abrid primero un incident para poder discutir en profundidad.

Actualizad los test si es necesario en cada contribución.