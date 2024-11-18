#!/bin/sh

# BACKEND EN SEGUNDO PLANO
echo "Starting backend server..."
npm run dev &

# WAIT HASTA QUE SE CREAN TABLAS
echo "Running database initialization script..."
node /app/scripts/init-movies.js

# Mantén el contenedor corriendo
wait