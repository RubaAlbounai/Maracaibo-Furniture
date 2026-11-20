FROM php:8.2-apache

# system packages, the zip extension (Composer uses it) and mod_rewrite (Laravel routes)
RUN apt-get update \
    && apt-get install -y --no-install-recommends git unzip libzip-dev \
    && docker-php-ext-install zip \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
ENV COMPOSER_ALLOW_SUPERUSER=1

# serve the public/ folder, allow .htaccess, and show index.html before index.php
RUN sed -ri 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/*.conf \
    && printf '<Directory /var/www/html/public>\n    AllowOverride All\n    Require all granted\n</Directory>\n' > /etc/apache2/conf-available/laravel.conf \
    && a2enconf laravel \
    && sed -i 's/DirectoryIndex .*/DirectoryIndex index.html index.php/' /etc/apache2/mods-available/dir.conf

WORKDIR /var/www/html

# install the dependencies first so Docker can cache this step
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --no-interaction --prefer-dist

COPY . .
RUN composer dump-autoload --optimize --no-dev --no-scripts \
    && cp docker/start.sh /usr/local/bin/start.sh \
    && sed -i 's/\r$//' /usr/local/bin/start.sh \
    && chmod +x /usr/local/bin/start.sh

EXPOSE 10000
CMD ["start.sh"]
