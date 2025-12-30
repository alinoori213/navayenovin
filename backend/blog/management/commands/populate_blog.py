from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from blog.models import Post, News, Category
from django.utils.text import slugify

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate blog and news with fake data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating fake blog and news data...')

        # Ensure we have a user to assign as author
        author = User.objects.filter(is_teacher=True).first()
        if not author:
            author = User.objects.create_user(username='blog_admin', password='password123', is_staff=True)
            self.stdout.write('Created fallback author: blog_admin')

        # Create Categories
        categories_data = ['آموزشی', 'اخبار آموزشگاه', 'معرفی ساز', 'تئوری موسیقی']
        categories = {}
        for cat_name in categories_data:
            cat, created = Category.objects.get_or_create(name=cat_name, defaults={'slug': slugify(cat_name, allow_unicode=True)})
            categories[cat_name] = cat
            if created:
                self.stdout.write(f'Category created: {cat_name}')

        # Create Posts
        posts_data = [
            {
                'title': 'چگونه تمرین موسیقی موثرتری داشته باشیم؟',
                'content': 'تمرین موسیقی فقط تکرار نیست. برای پیشرفت سریع‌تر باید تمرین هوشمندانه داشته باشید. در این مقاله به بررسی روش‌های تمرین موثر می‌پردازیم...',
                'category': 'آموزشی'
            },
            {
                'title': 'آشنایی با تاریخچه پیانو',
                'content': 'پیانو یکی از محبوب‌ترین سازهای جهان است که تاریخچه‌ای غنی دارد. از اختراع آن توسط بارتولومئو کریستوفری تا پیانوهای دیجیتال امروزی...',
                'category': 'معرفی ساز'
            },
            {
                'title': 'تاثیر موسیقی بر رشد مغز کودکان',
                'content': 'تحقیقات نشان می‌دهد که یادگیری موسیقی در سنین کودکی می‌تواند تاثیرات شگرفی بر رشد مغزی، حافظه و مهارت‌های ریاضی کودکان داشته باشد.',
                'category': 'آموزشی'
            },
             {
                'title': 'تئوری موسیقی به زبان ساده: گام‌ها',
                'content': 'گام‌ها پایه‌های اصلی ملودی و هارمونی در موسیقی هستند. در این مطلب با انواع گام‌های ماژور و مینور آشنا می‌شویم.',
                'category': 'تئوری موسیقی'
            }
        ]

        for post_data in posts_data:
            slug = slugify(post_data['title'], allow_unicode=True)
            if not Post.objects.filter(slug=slug).exists():
                Post.objects.create(
                    title=post_data['title'],
                    slug=slug,
                    content=post_data['content'],
                    author=author,
                    category=categories.get(post_data['category'])
                )
                self.stdout.write(f'Post created: {post_data["title"]}')
            else:
                self.stdout.write(f'Post already exists: {post_data["title"]}')

        # Create News
        news_data = [
            {
                'title': 'برگزاری کنسرت هنرجویان در پایان ترم',
                'content': 'به اطلاع هنرجویان عزیز می‌رسانیم که کنسرت پایان ترم در تاریخ ۱۵ اسفند ماه برگزار خواهد شد. جهت ثبت‌نام به دفتر آموزشگاه مراجعه کنید.'
            },
            {
                'title': 'تخفیف ویژه ثبت‌نام کلاس‌های گروهی',
                'content': 'برای فصل جدید، کلاس‌های گروهی تئوری موسیقی و سلفژ با ۲۰ درصد تخفیف ارائه می‌شوند. فرصت را از دست ندهید!'
            },
            {
                'title': 'اضافه شدن کلاس‌های ساز قانون',
                'content': 'با افتخار اعلام می‌کنیم که کلاس‌های آموزش ساز قانون با حضور استاد برجسته به مجموعه کلاس‌های ما اضافه شد.'
            }
        ]

        for item in news_data:
            slug = slugify(item['title'], allow_unicode=True)
            if not News.objects.filter(slug=slug).exists():
                News.objects.create(
                    title=item['title'],
                    slug=slug,
                    content=item['content']
                )
                self.stdout.write(f'News created: {item["title"]}')
            else:
                self.stdout.write(f'News already exists: {item["title"]}')

        self.stdout.write(self.style.SUCCESS('Successfully populated blog and news data'))
