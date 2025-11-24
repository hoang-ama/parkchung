# ParkChung Blog Deployment Guide

## 1. Overview

* Blog runs on **the same EC2 instance** as the main website.
* Blog domain: **[https://blog.parkchung.com](https://blog.parkchung.com)**
* Main site: **[https://www.parkchung.com/index.html](https://www.parkchung.com/index.html)**
* WordPress runs inside Docker + MariaDB.
* Nginx reverse proxy handles HTTPS.

---

## 2. DNS Setup

DNS configuration:

```
A blog → 54.179.23.187 (DNS only)
```

---

## 3. Clean Removal of Old Blog Stack

Remove old containers and volumes:

```bash
cd /var/www/parkchung/infra/blog
docker compose down -v
```

Remove outdated `/blog` Nginx config:

```bash
sudo rm /etc/nginx/sites-enabled/blog
sudo rm /etc/nginx/sites-available/blog
sudo nginx -t
sudo systemctl reload nginx
```

Keep main Nginx config for [www.parkchung.com](http://www.parkchung.com) untouched.

---

## 4. New Folder Structure

Blog stack location:

```
/var/www/parkchung/infra/blog
```

---

## 5. Environment File (.env)

Final working environment variables:

```bash
WORDPRESS_DB_HOST=db:3306
WORDPRESS_DB_USER=wp_user
WORDPRESS_DB_PASSWORD=<strong-password>
WORDPRESS_DB_NAME=parkchung_blog
WORDPRESS_TABLE_PREFIX=wp_

MYSQL_ROOT_PASSWORD=<strong-root-password>
MYSQL_DATABASE=parkchung_blog
MYSQL_USER=wp_user
MYSQL_PASSWORD=<strong-password>
```

---

## 6. Final docker-compose.yml

Final working compose file using:

* `mariadb:11.3`
* `wordpress:php8.0-apache`
* Network: `blog-net` (bridge driver)
* Volumes: `wp_data` (for wp-content), `db_data` (for MariaDB)
* Port mapping: `127.0.0.1:8080:80`
* `WORDPRESS_CONFIG_EXTRA` setting:

  ```
  WP_HOME = https://blog.parkchung.com
  WP_SITEURL = https://blog.parkchung.com
  ```

---

## 7. Starting the Stack

Exact commands:

```bash
cd /var/www/parkchung/infra/blog
docker compose up -d
docker compose ps
curl -I http://127.0.0.1:8080/
```

---

## 8. Nginx Setup for blog.parkchung.com

Working file: `/etc/nginx/sites-available/blog.conf`

Content:

```nginx
server {
    listen 80;
    server_name blog.parkchung.com;

    location / {
        proxy_pass http://127.0.0.1:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/blog.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 9. SSL Setup

Exact working Certbot command:

```bash
sudo certbot --nginx -d blog.parkchung.com
```

---

## 10. WordPress Installation

Access via browser: `https://blog.parkchung.com`

Complete WP setup form (site title, admin username, password, email).

---

## 11. Increase PHP Upload Limit

Create file inside WordPress container:

```bash
cd /var/www/parkchung/infra/blog
docker compose exec wordpress bash -c 'cat > /usr/local/etc/php/conf.d/uploads.ini << EOF
upload_max_filesize = 1024M
post_max_size = 1024M
memory_limit = 2048M
max_execution_time = 3000
max_input_time = 3000
EOF'
```

Restart container:

```bash
docker compose restart wordpress
```

---

## 12. Increase All-in-One WP Migration Import Limit

Edit file inside WordPress container:

```bash
cd /var/www/parkchung/infra/blog
docker compose exec wordpress bash
nano /var/www/html/wp-content/plugins/all-in-one-wp-migration/constants.php
```

Change:

```php
define('AI1WM_MAX_FILE_SIZE', 2 * 1024 * 1024 * 1024);
```

Or edit directly from host:

```bash
cd /var/www/parkchung/infra/blog
docker compose exec wordpress sed -i "s/define('AI1WM_MAX_FILE_SIZE', .*);/define('AI1WM_MAX_FILE_SIZE', 2 * 1024 * 1024 * 1024);/" /var/www/html/wp-content/plugins/all-in-one-wp-migration/constants.php
```

Restart container:

```bash
docker compose restart wordpress
```

---

## 13. Import .wpress Successfully

Import completed successfully after increasing the limits.

1. Access `https://blog.parkchung.com/wp-admin`
2. Navigate to **All-in-One WP Migration → Import**
3. Upload `.wpress` file
4. Wait for import to complete
5. Verify posts and pages appear on the public site

---

## 14. Update Main Website Button

Updated the "Blog" button in:

```
/var/www/parkchung/client/customer/index.html
```

Working link:

```html
<a href="https://blog.parkchung.com" target="_blank" rel="noopener noreferrer" data-i18n="sup_blog">Blog</a>
```
