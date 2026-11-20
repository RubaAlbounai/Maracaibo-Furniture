#!/bin/sh
set -e
cd /var/www/html

# Render tells the app which port to listen on
PORT="${PORT:-10000}"
sed -i "s/Listen 80/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:80>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf

# APP_KEY should be set in the Render settings. This is only a fallback.
if [ -z "${APP_KEY}" ]; then
  APP_KEY="$(php artisan key:generate --show)"
  export APP_KEY
fi

mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache

# with SQLite the database is a single file
if [ "${DB_CONNECTION}" = "sqlite" ]; then
  mkdir -p "$(dirname "${DB_DATABASE}")"
  touch "${DB_DATABASE}"
fi

php artisan package:discover --ansi
php artisan migrate --force --seed

chown -R www-data:www-data storage bootstrap/cache database
exec apache2-foreground
