# راهنمای دیپلوی پروژه نوای نوین روی سرور اوبونتو (Ubuntu)

این مستند مراحل کامل راه‌اندازی پروژه جنگو (Django) روی یک سرور لینوکس (اوبونتو) را با استفاده از Gunicorn و Nginx توضیح می‌دهد.

## ۱. پیش‌نیازها

- یک سرور اوبونتو (نسخه ۲۰.۰۴ یا ۲۲.۰۴)
- دسترسی کاربر با امتیاز `sudo`
- نام دامنه (Domain Name) متصل به IP سرور (اختیاری ولی توصیه شده)

## ۲. آماده‌سازی سرور

ابتدا مخازن پکیج‌ها را آپدیت کرده و ابزارهای مورد نیاز را نصب کنید:

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install python3-pip python3-dev libpq-dev postgresql postgresql-contrib nginx curl git -y
```

## ۳. تنظیم پایگاه داده (PostgreSQL)

اگرچه پروژه به صورت پیش‌فرض با SQLite کار می‌کند، اما برای محیط عملیاتی (Production) استفاده از PostgreSQL توصیه می‌شود.

```bash
sudo -u postgres psql
```

در محیط SQL دستورات زیر را وارد کنید:

```sql
CREATE DATABASE navayenovin_db;
CREATE USER navayenovin_user WITH PASSWORD 'password123';
ALTER ROLE navayenovin_user SET client_encoding TO 'utf8';
ALTER ROLE navayenovin_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE navayenovin_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE navayenovin_db TO navayenovin_user;
\q
```
*(رمز عبور قوی‌تری جایگزین `password123` کنید)*

## ۴. دریافت پروژه و نصب نیازمندی‌ها

پروژه را در مسیر دلخواه (مثلاً `/home/ubuntu/navayenovin`) کلون کنید:

```bash
cd /home/ubuntu
git clone <URL_REPOSITORY_SHOMA> navayenovin
cd navayenovin/backend
```

یک محیط مجازی (Virtual Environment) بسازید و فعال کنید:

```bash
python3 -m venv venv
source venv/bin/activate
```

پکیج‌ها را نصب کنید:

```bash
pip install -r requirements.txt
pip install psycopg2-binary  # در صورت استفاده از PostgreSQL
```

## ۵. تنظیمات پروژه (Settings)

فایل `backend/config/settings.py` را برای محیط عملیاتی تنظیم کنید. بهتر است از متغیرهای محیطی (Environment Variables) استفاده کنید، اما برای شروع می‌توانید تغییرات زیر را اعمال کنید:

```python
# settings.py

DEBUG = False
ALLOWED_HOSTS = ['your_server_ip', 'your_domain.com']

# تنظیمات دیتابیس (در صورت استفاده از Postgres)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'navayenovin_db',
        'USER': 'navayenovin_user',
        'PASSWORD': 'password123',
        'HOST': 'localhost',
        'PORT': '',
    }
}

# مسیر فایل‌های استاتیک
import os
STATIC_ROOT = os.path.join(BASE_DIR, 'static_root')
```

سپس دستورات زیر را اجرا کنید:

```bash
python manage.py collectstatic
python manage.py migrate
python manage.py createsuperuser
```

## ۶. تنظیم Gunicorn

برای اجرای پروژه در پس‌زمینه، یک فایل سرویس Systemd بسازید:

```bash
sudo nano /etc/systemd/system/navayenovin.service
```

محتوای زیر را در آن قرار دهید (مسیرها و نام کاربر را مطابق سرور خود تغییر دهید):

```ini
[Unit]
Description=gunicorn daemon for Navaye Novin
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/navayenovin/backend
ExecStart=/home/ubuntu/navayenovin/backend/venv/bin/gunicorn --access-logfile - --workers 3 --bind unix:/home/ubuntu/navayenovin/backend/navayenovin.sock config.wsgi:application

[Install]
WantedBy=multi-user.target
```

سرویس را فعال و اجرا کنید:

```bash
sudo systemctl start navayenovin
sudo systemctl enable navayenovin
```

## ۷. تنظیم Nginx

یک فایل تنظیمات برای Nginx بسازید:

```bash
sudo nano /etc/nginx/sites-available/navayenovin
```

محتوای زیر را وارد کنید:

```nginx
server {
    listen 80;
    server_name your_server_ip or_your_domain.com;

    location = /favicon.ico { access_log off; log_not_found off; }
    
    # تنظیم فایل‌های استاتیک
    location /static/ {
        alias /home/ubuntu/navayenovin/backend/static_root/;
    }

    # تنظیم فایل‌های مدیا
    location /media/ {
        alias /home/ubuntu/navayenovin/backend/media/;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/home/ubuntu/navayenovin/backend/navayenovin.sock;
    }
}
```

سایت را فعال کنید:

```bash
sudo ln -s /etc/nginx/sites-available/navayenovin /etc/nginx/sites-enabled
sudo nginx -t
sudo systemctl restart nginx
```

## ۸. تنظیم فایروال (اختیاری)

```bash
sudo ufw allow 'Nginx Full'
```

## ۹. نصب SSL (برای HTTPS)

اگر دامنه دارید، با استفاده از Certbot گواهی SSL رایگان بگیرید:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your_domain.com
```

---

**تبریک!** پروژه شما اکنون روی سرور عملیاتی شده است.
