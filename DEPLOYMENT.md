# راهنمای دیپلوی پروژه روی سرور اوبونتو (Ubuntu)

این راهنما مراحل کامل دیپلوی پروژه جنگو (Navaye Novin) روی سرور اوبونتو با استفاده از Nginx و Gunicorn را توضیح می‌دهد.

## پیش‌نیازها

- سرور اوبونتو (نسخه ۲۰.۰۴ یا ۲۲.۰۴)
- دسترسی روت (sudo)
- دامین متصل به سرور (در اینجا `legatocore.com`)

## مرحله ۱: نصب پکیج‌های ضروری

ابتدا مخازن را آپدیت کرده و پایتون، pip، و Nginx را نصب کنید:

```bash
sudo apt update
sudo apt install python3-pip python3-venv nginx -y
```

## مرحله ۲: دریافت پروژه

پروژه را روی سرور کلون کنید (یا فایل‌ها را آپلود کنید). فرض می‌کنیم پروژه در مسیر `/home/ubuntu/navayenovin` قرار می‌گیرد.

```bash
cd /home/ubuntu
# اگر از گیت استفاده می‌کنید:
# git clone <your-repo-url> navayenovin
```

## مرحله ۳: ایجاد محیط مجازی و نصب وابستگی‌ها

وارد پوشه `backend` شوید و محیط مجازی بسازید:

```bash
cd /home/ubuntu/navayenovin/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## مرحله ۴: تنظیمات محیطی (.env)

یک فایل `.env` در کنار `manage.py` بسازید و تنظیمات زیر را در آن قرار دهید:

```bash
nano .env
```

محتوای فایل `.env`:

```ini
DEBUG=False
SECRET_KEY=your-secure-secret-key-change-this
ALLOWED_HOSTS=legatocore.com,www.legatocore.com,localhost,127.0.0.1
```
(برای خروج از nano دکمه `Ctrl+X` سپس `Y` و `Enter` را بزنید.)

## مرحله ۵: آماده‌سازی دیتابیس و فایل‌های استاتیک

```bash
# اعمال مایگریشن‌ها
python manage.py migrate

# جمع‌آوری فایل‌های استاتیک
python manage.py collectstatic --noinput
```

**مهم (دسترسی دیتابیس SQLite):**
چون از SQLite استفاده می‌کنیم، Nginx/Gunicorn (با کاربر `www-data`) باید دسترسی نوشتن به فایل دیتابیس و پوشه آن را داشته باشند:

```bash
sudo chown :www-data /home/ubuntu/navayenovin/backend
sudo chown :www-data /home/ubuntu/navayenovin/backend/db.sqlite3
sudo chmod 775 /home/ubuntu/navayenovin/backend
sudo chmod 664 /home/ubuntu/navayenovin/backend/db.sqlite3
```

## مرحله ۶: تنظیم سرویس Gunicorn

یک فایل سرویس برای مدیریت Gunicorn بسازید:

```bash
sudo nano /etc/systemd/system/navayenovin.service
```

محتوای فایل:

```ini
[Unit]
Description=gunicorn daemon
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/navayenovin/backend
ExecStart=/home/ubuntu/navayenovin/backend/venv/bin/gunicorn \
          --access-logfile - \
          --workers 3 \
          --bind unix:/home/ubuntu/navayenovin/backend/navayenovin.sock \
          config.wsgi:application

[Install]
WantedBy=multi-user.target
```

سرویس را فعال و استارت کنید:

```bash
sudo systemctl start navayenovin
sudo systemctl enable navayenovin
```

بررسی وضعیت سرویس:
```bash
sudo systemctl status navayenovin
```

## مرحله ۷: تنظیم Nginx

یک تنظیمات جدید برای سایت بسازید:

```bash
sudo nano /etc/nginx/sites-available/navayenovin
```

محتوای فایل:

```nginx
server {
    listen 80;
    server_name legatocore.com www.legatocore.com;

    location = /favicon.ico { access_log off; log_not_found off; }
    
    # مسیر فایل‌های استاتیک
    location /static/ {
        alias /home/ubuntu/navayenovin/backend/staticfiles/;
    }

    # مسیر فایل‌های مدیا (آپلودی)
    location /media/ {
        alias /home/ubuntu/navayenovin/backend/media/;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/home/ubuntu/navayenovin/backend/navayenovin.sock;
    }
}
```
*نکته: مطمئن شوید مسیر `staticfiles` در `settings.py` (متغیر `STATIC_ROOT`) تنظیم شده باشد. اگر تنظیم نیست، در `settings.py` اضافه کنید:*
`STATIC_ROOT = BASE_DIR / 'staticfiles'`

فعال‌سازی تنظیمات:

```bash
sudo ln -s /etc/nginx/sites-available/navayenovin /etc/nginx/sites-enabled
sudo nginx -t
sudo systemctl restart nginx
```

## مرحله ۸: تنظیمات فایروال (اختیاری ولی پیشنهادی)

```bash
sudo ufw allow 'Nginx Full'
```

---

## عیب‌یابی

اگر سایت بالا نیامد یا خطای 500/400 داشتید:

1. **لاگ‌های Gunicorn:** `sudo journalctl -u navayenovin`
2. **لاگ‌های Nginx:** `sudo tail -f /var/log/nginx/error.log`
3. **بررسی تغییرات کد:** بعد از هر تغییر در کد پایتون، سرویس را ریستارت کنید:
   ```bash
   sudo systemctl restart navayenovin
   ```
