import uuid
from django.db import models
from accounts.models import User

# --- Generic Survey Models ---

class Survey(models.Model):
    title = models.CharField(max_length=200, verbose_name="عنوان نظرسنجی")
    description = models.TextField(blank=True, verbose_name="توضیحات")
    slug = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, verbose_name="لینک یکتا")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")
    is_active = models.BooleanField(default=True, verbose_name="فعال")

    class Meta:
        verbose_name = "نظرسنجی"
        verbose_name_plural = "نظرسنجی‌ها"
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class Question(models.Model):
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE, related_name='questions', verbose_name="نظرسنجی")
    text = models.CharField(max_length=500, verbose_name="متن سوال")
    
    class Meta:
        verbose_name = "سوال"
        verbose_name_plural = "سوالات"

    def __str__(self):
        return self.text

class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='choices', verbose_name="سوال")
    text = models.CharField(max_length=200, verbose_name="گزینه")

    class Meta:
        verbose_name = "گزینه"
        verbose_name_plural = "گزینه‌ها"

    def __str__(self):
        return self.text

class Response(models.Model):
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE, related_name='responses', verbose_name="نظرسنجی")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ثبت")
    ip_address = models.GenericIPAddressField(null=True, blank=True, verbose_name="آدرس IP")

    class Meta:
        verbose_name = "پاسخ‌نامه"
        verbose_name_plural = "پاسخ‌نامه‌ها"
        ordering = ['-created_at']

    def __str__(self):
        return f"Response to {self.survey.title} at {self.created_at}"

class Answer(models.Model):
    response = models.ForeignKey(Response, on_delete=models.CASCADE, related_name='answers', verbose_name="پاسخ‌نامه")
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers', verbose_name="سوال")
    choice = models.ForeignKey(Choice, on_delete=models.CASCADE, verbose_name="گزینه انتخاب شده")

    class Meta:
        verbose_name = "پاسخ"
        verbose_name_plural = "پاسخ‌ها"

# --- Teacher Survey Models ---

class TeacherSurvey(models.Model):
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='surveys', limit_choices_to={'is_teacher': True}, verbose_name="استاد")
    title = models.CharField(max_length=200, verbose_name="عنوان نظرسنجی")
    slug = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, verbose_name="لینک یکتا")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")
    is_active = models.BooleanField(default=True, verbose_name="فعال")

    class Meta:
        verbose_name = "نظرسنجی استاد"
        verbose_name_plural = "نظرسنجی‌های اساتید"
        ordering = ['-created_at']

    def __str__(self):
        return f"نظرسنجی {self.teacher.get_full_name()} - {self.title}"

class TeacherSurveyQuestion(models.Model):
    survey = models.ForeignKey(TeacherSurvey, on_delete=models.CASCADE, related_name='questions', verbose_name="نظرسنجی")
    text = models.CharField(max_length=500, verbose_name="متن سوال")

    class Meta:
        verbose_name = "سوال نظرسنجی استاد"
        verbose_name_plural = "سوالات نظرسنجی استاد"

    def __str__(self):
        return self.text

class TeacherSurveyResponse(models.Model):
    survey = models.ForeignKey(TeacherSurvey, on_delete=models.CASCADE, related_name='responses', verbose_name="نظرسنجی")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ثبت")
    ip_address = models.GenericIPAddressField(null=True, blank=True, verbose_name="آدرس IP")

    class Meta:
        verbose_name = "پاسخ‌نامه نظرسنجی استاد"
        verbose_name_plural = "پاسخ‌نامه‌های نظرسنجی استاد"
        ordering = ['-created_at']

class TeacherSurveyAnswer(models.Model):
    SCORE_CHOICES = [
        (1, 'خیلی بد'),
        (2, 'بد'),
        (3, 'متوسط'),
        (4, 'خوب'),
        (5, 'خیلی خوب'),
    ]

    response = models.ForeignKey(TeacherSurveyResponse, on_delete=models.CASCADE, related_name='answers', verbose_name="پاسخ‌نامه")
    question = models.ForeignKey(TeacherSurveyQuestion, on_delete=models.CASCADE, related_name='answers', verbose_name="سوال")
    score = models.IntegerField(choices=SCORE_CHOICES, verbose_name="امتیاز")

    class Meta:
        verbose_name = "پاسخ نظرسنجی استاد"
        verbose_name_plural = "پاسخ‌های نظرسنجی استاد"
