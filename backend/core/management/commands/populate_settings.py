from django.core.management.base import BaseCommand
from core.models import SiteSetting

class Command(BaseCommand):
    help = 'Populates the database with default site settings'

    def handle(self, *args, **kwargs):
        settings = [
            # Hero
            {
                'key': 'home_hero_title',
                'value': 'آموزشگاه موسیقی نوای نوین',
                'description': 'Home Page Hero Title'
            },
            {
                'key': 'home_hero_subtitle',
                'value': 'با هدف رشد موسیقی کلاسیک در ایران',
                'description': 'Home Page Hero Subtitle'
            },
            {
                'key': 'home_hero_button_text',
                'value': 'مشاهده کلاس‌ها',
                'description': 'Home Page Hero Button Text'
            },
            {
                'key': 'home_hero_quote',
                'value': 'موسیقی، ادبیات قلب است. از جایی شروع می شود که سخن پایان یابد.',
                'description': 'Home Page Hero Quote'
            },
            {
                'key': 'home_hero_quote_author',
                'value': '"آلفونس دو لا مارتین"',
                'description': 'Home Page Hero Quote Author'
            },
            # About
            {
                'key': 'about_hero_title',
                'value': 'درباره آموزشگاه',
                'description': 'About Page Hero Title'
            },
            {
                'key': 'about_mission_title',
                'value': 'ماموریت ما',
                'description': 'About Page Mission Title'
            },
            {
                'key': 'about_mission_desc_1',
                'value': 'ما در نوای نوین تلاش میکنیم موسیقی را با بهترین کیفیت آموزش ارائه دهیم، با تمرکز ویژه بر موسیقی کلاسیک و استانداردهای جهانی.',
                'description': 'About Page Mission Description Paragraph 1'
            },
            {
                'key': 'about_mission_desc_2',
                'value': 'هدف ما این است که هنرجویان نه‌تنها موسیقی را یاد بگیرند، بلکه آن را زندگی کنند و در مسیر رشد شخصی و هنرمندان به جایگاهی برسند که بتوانند در ایران و جهان بدرخشند.',
                'description': 'About Page Mission Description Paragraph 2'
            },
            {
                'key': 'about_experience_title',
                'value': 'تجربه‌های ویژه',
                'description': 'About Page Experience Title'
            },
            {
                'key': 'about_experience_intro',
                'value': 'در نوای نوین، یادگیری موسیقی فقط به کلاس محدود نمی‌شود.',
                'description': 'About Page Experience Intro'
            },
            {
                'key': 'about_experience_desc',
                'value': 'ما تجربه‌ای کامل و الهام‌بخش برای هنرجویان می‌سازیم؛ آموزش با متدهای روز دنیا و آمادگی برای آزمون‌های بین‌المللی مانند ABRSM، کلاس‌ها و کارگاه‌های تخصصی با همکاری استادان برجسته، اجرای کنسرت‌های هنرجویی برای نمایش توانایی‌ها و افزایش اعتمادبه‌نفس، و دورهمی‌ها و ایونت‌های موسیقی برای ایجاد یک جامعه صمیمی و حرفه‌ای، همه بخشی از مسیر یادگیری ما هستند.',
                'description': 'About Page Experience Description'
            },
            {
                'key': 'about_values_title',
                'value': 'ارزش‌های ما',
                'description': 'About Page Values Title'
            },
            {
                'key': 'about_values_intro',
                'value': 'در مسیر آموزش، ما بر ارزش‌هایی پایبندیم که هویت آموزشگاه ما را می‌سازند:',
                'description': 'About Page Values Intro'
            },
            {
                'key': 'about_value_1',
                'value': 'کیفیت در آموزش',
                'description': 'About Page Value 1'
            },
            {
                'key': 'about_value_2',
                'value': 'استانداردهای جهانی',
                'description': 'About Page Value 2'
            },
            {
                'key': 'about_value_3',
                'value': 'تعهد به رشد هنری',
                'description': 'About Page Value 3'
            },
            {
                'key': 'about_value_4',
                'value': 'ایجاد جامعه موسیقایی',
                'description': 'About Page Value 4'
            },
            # Experience Home
            {
                'key': 'home_experience_title',
                'value': 'با ما دنیای موسیقی را تجربه کنید.',
                'description': 'Home Page Experience Title'
            },
            {
                'key': 'home_experience_desc',
                'value': '«در نوای نوین، یادگیری موسیقی تنها یک آموزش نیست؛ تجربه‌ای است برای رشد الهام و رسیدن به استانداردهای جهانی»',
                'description': 'Home Page Experience Description'
            },
            {
                'key': 'home_experience_button',
                'value': 'درباره ما ←',
                'description': 'Home Page Experience Button'
            },
            # Events
            {
                'key': 'home_events_title',
                'value': 'رویدادهای پیش رو',
                'description': 'Home Events Section Title'
            },
             {
                'key': 'event_1_title',
                'value': 'دورهمی موسیقی کلاسیک',
                'description': 'Event 1 Title'
            },
             {
                'key': 'event_2_title',
                'value': 'دورهمی هنرجویان نوای نوین',
                'description': 'Event 2 Title'
            },
             {
                'key': 'event_3_title',
                'value': 'شروع کلاس‌های تاریخ موسیقی',
                'description': 'Event 3 Title'
            },
            {
                'key': 'contact_title',
                'value': 'با ما در ارتباط باشید.',
                'description': 'Contact Page Title'
            },
            {
                'key': 'contact_ways_title',
                'value': 'راه‌های ارتباطی',
                'description': 'Contact Page Ways Title'
            },
            {
                'key': 'contact_form_title',
                'value': 'برای ما پیام بذارید',
                'description': 'Contact Page Form Title'
            },
            # Courses
            {
                'key': 'courses_hero_title',
                'value': 'کلاس‌های ما',
                'description': 'Courses Page Hero Title'
            },
            {
                'key': 'courses_intro_title',
                'value': 'شروع سفر شما به دنیای موسیقی',
                'description': 'Courses Page Intro Title'
            },
            {
                'key': 'courses_intro_subtitle',
                'value': 'با ما همراه شوید و تجربه‌ای متفاوت و حرفه‌ای در دنیای موسیقی کلاسیک کسب کنید',
                'description': 'Courses Page Intro Subtitle'
            },
            {
                'key': 'search_placeholder',
                'value': 'جستجو در کلاس‌ها...',
                'description': 'Search Placeholder'
            },
            {
                'key': 'all_tags',
                'value': 'همه',
                'description': 'All Tags Label'
            },
            {
                'key': 'showing_teacher_courses',
                'value': 'نمایش کلاس‌های استاد:',
                'description': 'Showing Teacher Courses Message'
            },
             # Home Courses Section
             {
                'key': 'home_courses_title',
                'value': 'کلاس‌های در حال ثبت نام',
                'description': 'Home Courses Section Title'
            },
             {
                'key': 'course_more_info_button',
                'value': 'اطلاعات تکمیلی',
                'description': 'Course More Info Button'
            },
            # Blog & News
            {
                'key': 'blog_title',
                'value': 'وبلاگ نوای نوین',
                'description': 'Blog Page Title'
            },
            {
                'key': 'news_title',
                'value': 'اخبار آموزشگاه',
                'description': 'News Page Title'
            },
            {
                'key': 'read_more',
                'value': 'ادامه مطلب',
                'description': 'Read More Button Text'
            },
            # Auth
            {
                'key': 'login_title',
                'value': 'ورود به حساب کاربری',
                'description': 'Login Page Title'
            },
            {
                'key': 'register_title',
                'value': 'ثبت نام در نوای نوین',
                'description': 'Register Page Title'
            },
            {
                'key': 'username_label',
                'value': 'نام کاربری',
                'description': 'Username Label'
            },
            {
                'key': 'password_label',
                'value': 'رمز عبور',
                'description': 'Password Label'
            },
             {
                'key': 'email_label',
                'value': 'ایمیل',
                'description': 'Email Label'
            },
             {
                'key': 'first_name_label',
                'value': 'نام',
                'description': 'First Name Label'
            },
             {
                'key': 'last_name_label',
                'value': 'نام خانوادگی',
                'description': 'Auth Last Name Label'
            },
             {
                'key': 'phone_number_label',
                'value': 'شماره موبایل',
                'description': 'Auth Phone Number Label'
            },
             {
                'key': 'confirm_password_label',
                'value': 'تکرار رمز عبور',
                'description': 'Confirm Password Label'
            },
            {
                'key': 'login_button',
                'value': 'ورود',
                'description': 'Login Button Text'
            },
            {
                'key': 'register_button',
                'value': 'ثبت نام',
                'description': 'Register Button Text'
            },
             {
                'key': 'no_account_text',
                'value': 'حساب کاربری ندارید؟',
                'description': 'No Account Text'
            },
             {
                'key': 'already_registered_text',
                'value': 'قبلا ثبت نام کرده‌اید؟',
                'description': 'Already Registered Text'
            },
             {
                'key': 'login_link_text',
                'value': 'وارد شوید',
                'description': 'Login Link Text'
            },
             {
                'key': 'register_link_text',
                'value': 'ثبت نام کنید',
                'description': 'Register Link Text'
            },
            # Navigation
            {
                'key': 'nav_home',
                'value': 'صفحه اصلی',
                'description': 'Navigation Home Link'
            },
            {
                'key': 'nav_courses',
                'value': 'کلاس‌ها',
                'description': 'Navigation Courses Link'
            },
            {
                'key': 'nav_teachers',
                'value': 'اساتید',
                'description': 'Navigation Teachers Link'
            },
            {
                'key': 'nav_about',
                'value': 'درباره ما',
                'description': 'Navigation About Link'
            },
            {
                'key': 'nav_blog',
                'value': 'وبلاگ',
                'description': 'Navigation Blog Link'
            },
            {
                'key': 'nav_news',
                'value': 'اخبار',
                'description': 'Navigation News Link'
            },
             {
                'key': 'nav_welcome',
                'value': 'خوش آمدید',
                'description': 'Navigation Welcome Message'
            },
             {
                'key': 'nav_logout',
                'value': 'خروج',
                'description': 'Navigation Logout Button'
            },
             {
                'key': 'nav_login',
                'value': 'ورود',
                'description': 'Navigation Login Button'
            },
             {
                'key': 'nav_register',
                'value': 'ثبت نام',
                'description': 'Navigation Register Button'
            },
            # Teachers Page (Experience)
             {
                'key': 'teachers_hero_title',
                'value': 'اساتید ما',
                'description': 'Teachers Page Hero Title'
            },
             {
                'key': 'teachers_section_title',
                'value': 'با اساتید مجرب ما آشنا شوید',
                'description': 'Teachers Page Section Title'
            },
            # Latest Posts
             {
                'key': 'latest_posts_title',
                'value': 'آخرین مطالب و اخبار',
                'description': 'Latest Posts Section Title'
            },
             {
                'key': 'view_post_button',
                'value': 'مشاهده',
                'description': 'View Post Button Text'
            },
            # Teacher Detail
             {
                'key': 'teacher_detail_view_classes',
                'value': 'مشاهده کلاس‌ها',
                'description': 'Teacher Detail View Classes Button'
            },
             {
                'key': 'teacher_detail_about_prefix',
                'value': 'درباره',
                'description': 'Teacher Detail About Prefix'
            },
             {
                'key': 'teacher_detail_default_bio',
                'value': 'توضیحات درباره استاد به زودی اضافه می‌شود.',
                'description': 'Teacher Detail Default Bio'
            },
            # Post Detail (Blog/News)
             {
                'key': 'post_not_found',
                'value': 'مطلب مورد نظر یافت نشد.',
                'description': 'Post Not Found Message'
            },
             {
                'key': 'news_not_found',
                'value': 'خبر مورد نظر یافت نشد.',
                'description': 'News Not Found Message'
            },
             {
                'key': 'post_author_prefix',
                'value': 'نویسنده:',
                'description': 'Post Author Prefix'
            },
             {
                'key': 'back_to_blog',
                'value': 'بازگشت به وبلاگ',
                'description': 'Back to Blog Button'
            },
             {
                'key': 'back_to_news',
                'value': 'بازگشت به اخبار',
                'description': 'Back to News Button'
            },
             {
                'key': 'default_category',
                'value': 'مقاله',
                'description': 'Default Post Category'
            },
              {
                'key': 'news_category',
                'value': 'اخبار',
                'description': 'News Category Label'
            },
            # Common
             {
                'key': 'loading_text',
                'value': 'در حال بارگذاری...',
                'description': 'Loading Text'
            },
             {
                'key': 'image_placeholder',
                'value': 'تصویر ندارد',
                'description': 'Image Placeholder Text'
            },
            # Blog & News List
             {
                'key': 'blog_no_posts',
                'value': 'هیچ مطلبی یافت نشد.',
                'description': 'Blog No Posts Message'
            },
             {
                'key': 'news_no_news',
                'value': 'هیچ خبری یافت نشد.',
                'description': 'News No News Message'
            },
            # Auth Errors
             {
                'key': 'register_password_mismatch',
                'value': 'رمز عبور و تکرار آن مطابقت ندارند',
                'description': 'Register Password Mismatch Error'
            },
             {
                'key': 'register_error',
                'value': 'خطا در ثبت نام. لطفا مجددا تلاش کنید.',
                'description': 'Register General Error'
            },
             {
                'key': 'login_error',
                'value': 'نام کاربری یا رمز عبور اشتباه است',
                'description': 'Login Error'
            },
              {
                'key': 'profile_title',
                'value': 'پروفایل کاربری',
                'description': 'Profile Page Title'
            },
             {
                'key': 'profile_edit_button',
                'value': 'ویرایش اطلاعات',
                'description': 'Profile Edit Button'
            },
             {
                'key': 'profile_save_button',
                'value': 'ذخیره تغییرات',
                'description': 'Profile Save Button'
            },
             {
                'key': 'profile_cancel_button',
                'value': 'انصراف',
                'description': 'Profile Cancel Button'
            },
            # Footer
            {
                'key': 'footer_title',
                'value': 'آموزشگاه موسیقی نوای نوین',
                'description': 'Footer Title'
            },
            {
                'key': 'footer_description',
                'value': 'با هدف رشد موسیقی کلاسیک در ایران و رسیدن به استانداردهای جهانی',
                'description': 'Footer Description'
            },
            {
                'key': 'footer_address',
                'value': 'تهران، ایران',
                'description': 'Footer Address'
            },
            {
                'key': 'footer_email',
                'value': 'navayenovin.ir@gmail.com',
                'description': 'Footer Email'
            },
            {
                'key': 'footer_phone',
                'value': '021-12345678',
                'description': 'Footer Phone'
            },
            {
                'key': 'footer_copyright',
                'value': 'Copyright © 2025 آموزشگاه موسیقی نوای نوین | تمامی حقوق محفوظ است',
                'description': 'Footer Copyright'
            },
             {
                'key': 'footer_instagram_link',
                'value': 'https://instagram.com',
                'description': 'Footer Instagram Link'
            },
             {
                'key': 'footer_telegram_link',
                'value': 'https://telegram.org',
                'description': 'Footer Telegram Link'
            },
             {
                'key': 'footer_whatsapp_link',
                'value': 'https://wa.me',
                'description': 'Footer Whatsapp Link'
            },
        ]

        for setting in settings:
            obj, created = SiteSetting.objects.get_or_create(
                key=setting['key'],
                defaults={
                    'value': setting['value'],
                    'description': setting['description']
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created setting: {setting["key"]}'))
            else:
                self.stdout.write(self.style.WARNING(f'Setting already exists: {setting["key"]}'))
