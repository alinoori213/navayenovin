from django.db import models
from django.conf import settings
from django.utils import timezone
from courses.models import Enrollment, Course

class TeacherProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='teacher_profile')
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    
    def __str__(self):
        return f"Profile of {self.user.username}"

class Schedule(models.Model):
    DAYS_OF_WEEK = [
        ('0', 'شنبه'),
        ('1', 'یکشنبه'),
        ('2', 'دوشنبه'),
        ('3', 'سه‌شنبه'),
        ('4', 'چهارشنبه'),
        ('5', 'پنج‌شنبه'),
        ('6', 'جمعه'),
    ]
    teacher = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='schedules')
    day_of_week = models.CharField(max_length=1, choices=DAYS_OF_WEEK)
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_booked = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.teacher} - {self.get_day_of_week_display()} : {self.start_time}-{self.end_time}"

class FinancialRecord(models.Model):
    enrollment = models.OneToOneField(Enrollment, on_delete=models.CASCADE, related_name='financial_record')
    total_fee = models.DecimalField(max_digits=12, decimal_places=0, verbose_name="هزینه کل دوره")
    installment_count = models.IntegerField(default=1, verbose_name="تعداد اقساط")
    discount = models.DecimalField(max_digits=12, decimal_places=0, default=0, verbose_name="تخفیف")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Financials for {self.enrollment}"

    @property
    def total_payable(self):
        return self.total_fee - self.discount

    @property
    def total_paid(self):
        return sum(payment.amount for payment in self.payments.all())

    @property
    def remaining_debt(self):
        return self.total_payable - self.total_paid

class Payment(models.Model):
    PAYMENT_TYPES = [
        ('cash', 'نقدی'),
        ('card', 'کارت به کارت'),
        ('cheque', 'چک'),
        ('pos', 'دستگاه پوز'),
    ]
    financial_record = models.ForeignKey(FinancialRecord, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=12, decimal_places=0, verbose_name="مبلغ")
    date = models.DateField(default=timezone.now, verbose_name="تاریخ پرداخت")
    payment_type = models.CharField(max_length=10, choices=PAYMENT_TYPES, verbose_name="نوع پرداخت")
    description = models.TextField(blank=True, null=True, verbose_name="توضیحات")
    receipt = models.ImageField(upload_to='receipts/', blank=True, null=True, verbose_name="تصویر رسید")

    def __str__(self):
        return f"{self.amount} - {self.financial_record.enrollment.student}"

class LibraryResource(models.Model):
    title = models.CharField(max_length=200, verbose_name="عنوان")
    file = models.FileField(upload_to='library/', verbose_name="فایل")
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name="آپلود کننده")
    description = models.TextField(blank=True, null=True, verbose_name="توضیحات")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Message(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_messages', null=True, blank=True)
    subject = models.CharField(max_length=200, verbose_name="موضوع")
    body = models.TextField(verbose_name="متن پیام")
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.subject} - {self.sender} to {self.recipient}"

class MessageReadStatus(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='read_messages')
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='read_statuses')
    read_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'message')

    def __str__(self):
        return f"{self.user} read {self.message}"

class AttendanceSession(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='attendance_sessions', verbose_name="کلاس")
    date = models.DateField(default=timezone.now, verbose_name="تاریخ جلسه")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']
        unique_together = ('course', 'date')

    def __str__(self):
        return f"{self.course.title} - {self.date}"

class AttendanceRecord(models.Model):
    STATUS_CHOICES = [
        ('present', 'حاضر'),
        ('absent', 'غایب'),
        ('late', 'با تأخیر'),
    ]
    session = models.ForeignKey(AttendanceSession, on_delete=models.CASCADE, related_name='records')
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, limit_choices_to={'is_student': True}, verbose_name="هنرجو")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='present', verbose_name="وضعیت")
    note = models.CharField(max_length=200, blank=True, verbose_name="توضیحات")

    class Meta:
        unique_together = ('session', 'student')

    def __str__(self):
        return f"{self.student} - {self.get_status_display()}"

class Exam(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='exams', verbose_name="کلاس")
    title = models.CharField(max_length=200, verbose_name="عنوان آزمون")
    date = models.DateField(default=timezone.now, verbose_name="تاریخ آزمون")
    max_score = models.FloatField(default=20, verbose_name="نمره کل")
    description = models.TextField(blank=True, verbose_name="توضیحات")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.course.title}"

class ExamGrade(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='grades')
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, limit_choices_to={'is_student': True}, verbose_name="هنرجو")
    score = models.FloatField(verbose_name="نمره کسب شده")
    feedback = models.TextField(blank=True, verbose_name="بازخورد استاد")

    class Meta:
        unique_together = ('exam', 'student')

    def __str__(self):
        return f"{self.student} - {self.exam.title}: {self.score}"
