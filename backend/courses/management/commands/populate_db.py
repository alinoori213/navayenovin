import random
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from courses.models import Course

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate database with fake data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating fake data...')

        # Create Teachers
        teachers_data = [
            {
                'username': 'ali_noori',
                'first_name': 'علی',
                'last_name': 'نوری',
                'email': 'ali@example.com',
                'bio': 'مدرس پیانو با ۱۰ سال سابقه تدریس. فارغ‌التحصیل از کنسرواتوار تهران.',
                'password': 'password123'
            },
            {
                'username': 'sara_tehrani',
                'first_name': 'سارا',
                'last_name': 'تهرانی',
                'email': 'sara@example.com',
                'bio': 'نوازنده و مدرس ویولن. عضو ارکستر سمفونیک.',
                'password': 'password123'
            },
            {
                'username': 'reza_karimi',
                'first_name': 'رضا',
                'last_name': 'کریمی',
                'email': 'reza@example.com',
                'bio': 'مدرس گیتار کلاسیک و پاپ. مولف کتاب‌های آموزشی گیتار.',
                'password': 'password123'
            },
            {
                'username': 'maryam_hosseini',
                'first_name': 'مریم',
                'last_name': 'حسینی',
                'email': 'maryam@example.com',
                'bio': 'مدرس آواز کلاسیک و سلفژ. دارای مدرک کارشناسی ارشد موسیقی.',
                'password': 'password123'
            }
        ]

        created_teachers = []
        for t_data in teachers_data:
            user, created = User.objects.get_or_create(username=t_data['username'], defaults={
                'first_name': t_data['first_name'],
                'last_name': t_data['last_name'],
                'email': t_data['email'],
                'bio': t_data['bio'],
                'is_teacher': True,
                'is_student': False
            })
            if created:
                user.set_password(t_data['password'])
                user.save()
                self.stdout.write(self.style.SUCCESS(f'Teacher created: {user.username}'))
            else:
                self.stdout.write(f'Teacher already exists: {user.username}')
            created_teachers.append(user)

        # Create Courses
        courses_data = [
            {
                'title': 'آموزش مقدماتی پیانو',
                'description': 'در این دوره با اصول اولیه نوازندگی پیانو، نت‌خوانی و اجرای قطعات ساده آشنا می‌شوید.',
                'teacher_username': 'ali_noori',
                'price': 1500000,
                'tag': 'پیانو'
            },
            {
                'title': 'مسترکلاس ویولن',
                'description': 'دوره پیشرفته برای نوازندگان ویولن که می‌خواهند تکنیک‌های خود را بهبود بخشند.',
                'teacher_username': 'sara_tehrani',
                'price': 2000000,
                'tag': 'ویولن'
            },
            {
                'title': 'گیتار پاپ برای همه',
                'description': 'یادگیری آکوردها، ریتم‌ها و اجرای آهنگ‌های پاپ ایرانی و خارجی با گیتار.',
                'teacher_username': 'reza_karimi',
                'price': 1200000,
                'tag': 'گیتار'
            },
            {
                'title': 'سلفژ و تربیت شنوایی',
                'description': 'دوره ضروری برای همه هنرجویان موسیقی جهت تقویت گوش و درک ریتم و ملودی.',
                'teacher_username': 'maryam_hosseini',
                'price': 1000000,
                'tag': 'تئوری موسیقی'
            },
            {
                'title': 'تئوری موسیقی جامع',
                'description': 'آموزش کامل تئوری موسیقی از پایه تا پیشرفته.',
                'teacher_username': 'ali_noori',
                'price': 1000000,
                'tag': 'تئوری موسیقی'
            },
             {
                'title': 'آواز کلاسیک',
                'description': 'تکنیک‌های تنفس، صداسازی و اجرای قطعات آواز کلاسیک.',
                'teacher_username': 'maryam_hosseini',
                'price': 1800000,
                'tag': 'آواز'
            }
        ]

        for c_data in courses_data:
            teacher = User.objects.get(username=c_data['teacher_username'])
            course, created = Course.objects.get_or_create(title=c_data['title'], defaults={
                'description': c_data['description'],
                'teacher': teacher,
                'price': c_data['price'],
                'tag': c_data['tag']
            })
            if created:
                self.stdout.write(self.style.SUCCESS(f'Course created: {course.title}'))
            else:
                self.stdout.write(f'Course already exists: {course.title}')

        self.stdout.write(self.style.SUCCESS('Database populated successfully!'))
