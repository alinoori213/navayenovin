from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib.auth.views import LoginView
from django.contrib.auth import logout
from django.views.generic import ListView, DetailView, CreateView, DeleteView, UpdateView
from django.urls import reverse_lazy
from django.contrib import messages
from django.db.models import Sum, Count, Q, Avg
from django.utils import timezone
from datetime import timedelta
from django.forms import modelformset_factory
from .models import TeacherProfile, Schedule, FinancialRecord, Payment, LibraryResource, Message, MessageReadStatus, AttendanceSession, AttendanceRecord, Exam, ExamGrade
from accounts.models import User
from courses.models import Enrollment, Course
from surveys.models import TeacherSurvey

# Access Control
def is_manager(user):
    return user.is_staff or user.is_superuser

def is_teacher_or_manager(user):
    return getattr(user, 'is_teacher', False) or user.is_staff or user.is_superuser

class ManagerRequiredMixin(LoginRequiredMixin, UserPassesTestMixin):
    def test_func(self):
        return is_manager(self.request.user)

class TeacherOrManagerRequiredMixin(LoginRequiredMixin, UserPassesTestMixin):
    def test_func(self):
        return is_teacher_or_manager(self.request.user)

# Dashboard
@login_required
def dashboard(request):
    if not is_teacher_or_manager(request.user):
        return redirect('home') # Or some error page
    
    context = {}
    
    if is_manager(request.user):
        # Manager Dashboard Data
        context['total_students'] = User.objects.filter(is_student=True).count()
        context['total_teachers'] = User.objects.filter(is_teacher=True).count()
        
        # Financial Stats
        total_payments = Payment.objects.aggregate(Sum('amount'))['amount__sum'] or 0
        context['total_income'] = total_payments
        
        # Chart Data: Last 6 months income
        monthly_data = []
        labels = []
        today = timezone.now()
        
        for i in range(5, -1, -1):
            # Approximate months for simplicity
            month_target = today - timedelta(days=i*30)
            month_start = month_target.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            if month_start.month == 12:
                month_end = month_start.replace(year=month_start.year + 1, month=1)
            else:
                month_end = month_start.replace(month=month_start.month + 1)
            
            val = Payment.objects.filter(date__gte=month_start, date__lt=month_end).aggregate(Sum('amount'))['amount__sum'] or 0
            monthly_data.append(int(val))
            # Use simple numeric month or name
            labels.append(month_start.strftime("%m/%Y"))

        context['chart_data'] = monthly_data
        context['chart_labels'] = labels
        
        context['recent_payments'] = Payment.objects.order_by('-date')[:5]
        # context['unread_messages'] handled by context processor
        
    elif request.user.is_teacher:
        # Teacher Dashboard Data
        context['my_courses'] = Course.objects.filter(teacher=request.user)
        context['my_students'] = Enrollment.objects.filter(course__teacher=request.user).distinct()
        
        # Surveys
        surveys = TeacherSurvey.objects.filter(teacher=request.user)
        survey_data = []
        for survey in surveys:
            questions = survey.questions.all()
            total_score = 0
            questions_count = 0
            for q in questions:
                avg = q.answers.aggregate(Avg('score'))['score__avg']
                if avg:
                    total_score += avg
                    questions_count += 1
            
            survey_avg = (total_score / questions_count) if questions_count > 0 else 0
            survey_data.append({
                'survey': survey,
                'average': survey_avg,
                'response_count': survey.responses.count()
            })
        context['my_surveys'] = survey_data
    
    return render(request, 'management/dashboard.html', context)

# Auth
class CustomLoginView(LoginView):
    template_name = 'management/login.html'
    redirect_authenticated_user = True
    
    def get_success_url(self):
        return reverse_lazy('management:dashboard')

    def form_valid(self, form):
        response = super().form_valid(form)
        user = self.request.user
        direct_unread = Message.objects.filter(recipient=user, is_read=False).count()
        public_unread = Message.objects.filter(recipient__isnull=True).exclude(read_statuses__user=user).count()
        count = direct_unread + public_unread
        
        if count > 0:
            messages.info(self.request, f'شما {count} پیام خوانده نشده دارید.')
        return response

def custom_logout(request):
    logout(request)
    return redirect('management:login')

# Teachers
class TeacherListView(ManagerRequiredMixin, ListView):
    model = User
    template_name = 'management/teacher_list.html'
    context_object_name = 'teachers'

    def get_queryset(self):
        return User.objects.filter(is_teacher=True)

class TeacherCreateView(ManagerRequiredMixin, CreateView):
    model = User
    template_name = 'management/teacher_form.html'
    fields = ['username', 'first_name', 'last_name', 'email', 'phone_number', 'national_code', 'birth_date', 'bio', 'profile_picture']
    success_url = reverse_lazy('management:teacher_list')

    def form_valid(self, form):
        user = form.save(commit=False)
        user.is_teacher = True
        user.set_password(user.username)
        user.save()
        # Create TeacherProfile
        TeacherProfile.objects.create(user=user)
        return redirect(self.success_url)

class TeacherUpdateView(ManagerRequiredMixin, UpdateView):
    model = User
    template_name = 'management/teacher_form.html'
    fields = ['username', 'first_name', 'last_name', 'email', 'phone_number', 'national_code', 'birth_date', 'bio', 'profile_picture']
    success_url = reverse_lazy('management:teacher_list')
    
    def get_queryset(self):
        return User.objects.filter(is_teacher=True)

class TeacherDetailView(ManagerRequiredMixin, DetailView):

    model = User
    template_name = 'management/teacher_detail.html'
    context_object_name = 'teacher'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['schedules'] = Schedule.objects.filter(teacher=self.object)
        context['courses'] = Course.objects.filter(teacher=self.object)
        
        # Surveys
        surveys = TeacherSurvey.objects.filter(teacher=self.object)
        survey_data = []
        for survey in surveys:
            # Calculate average score for this survey
            questions = survey.questions.all()
            total_score = 0
            questions_count = 0
            for q in questions:
                avg = q.answers.aggregate(Avg('score'))['score__avg']
                if avg:
                    total_score += avg
                    questions_count += 1
            
            survey_avg = (total_score / questions_count) if questions_count > 0 else 0
            survey_data.append({
                'survey': survey,
                'average': survey_avg,
                'response_count': survey.responses.count()
            })
            
        context['surveys'] = survey_data
        return context

class TeacherDeleteView(ManagerRequiredMixin, DeleteView):
    model = User
    template_name = 'management/teacher_confirm_delete.html'
    success_url = reverse_lazy('management:teacher_list')
    context_object_name = 'teacher'
    
    def get_queryset(self):
        return User.objects.filter(is_teacher=True)

@login_required
def teacher_schedule(request, pk):
    # Only allow the teacher themselves or a manager
    if not (request.user.pk == pk or is_manager(request.user)):
        return redirect('management:dashboard')
        
    teacher = get_object_or_404(User, pk=pk)
    # Ensure profile exists
    if not hasattr(teacher, 'teacher_profile'):
        TeacherProfile.objects.create(user=teacher)
        
    profile = teacher.teacher_profile
    
    if request.method == 'POST':
        # Handle delete
        delete_id = request.POST.get('delete_id')
        if delete_id:
            Schedule.objects.filter(id=delete_id, teacher=teacher).delete()
            messages.success(request, 'زمان حذف شد.')
            return redirect('management:teacher_schedule', pk=pk)

        # Handle add
        day = request.POST.get('day')
        start_time = request.POST.get('start_time')
        end_time = request.POST.get('end_time')
        
        if day and start_time and end_time:
            Schedule.objects.create(
                teacher=teacher,
                day_of_week=day,
                start_time=start_time,
                end_time=end_time
            )
            messages.success(request, 'زمان جدید اضافه شد.')
            return redirect('management:teacher_schedule', pk=pk)
            
    schedules = teacher.schedules.all().order_by('day_of_week', 'start_time')
    return render(request, 'management/schedule_form.html', {'teacher': teacher, 'schedules': schedules})

# Students
class StudentListView(ListView):
    model = User
    template_name = 'management/student_list.html'
    context_object_name = 'students'

    def get_queryset(self):
        return User.objects.filter(is_student=True)

class StudentCreateView(ManagerRequiredMixin, CreateView):
    model = User
    template_name = 'management/student_form.html'
    fields = ['username', 'first_name', 'last_name', 'email', 'phone_number', 'national_code', 'birth_date']
    success_url = reverse_lazy('management:student_list')

    def form_valid(self, form):
        user = form.save(commit=False)
        user.is_student = True
        user.set_password(user.username)
        user.save()
        return redirect(self.success_url)

class StudentUpdateView(ManagerRequiredMixin, UpdateView):
    model = User
    template_name = 'management/student_form.html'
    fields = ['username', 'first_name', 'last_name', 'email', 'phone_number', 'national_code', 'birth_date']
    success_url = reverse_lazy('management:student_list')
    
    def get_queryset(self):
        return User.objects.filter(is_student=True)

class StudentDetailView(ManagerRequiredMixin, DetailView):
    model = User
    template_name = 'management/student_detail.html'
    context_object_name = 'student'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        enrollments = Enrollment.objects.filter(student=self.object)
        
        enrollment_data = []
        for enrollment in enrollments:
            # Ensure financial record exists
            record, created = FinancialRecord.objects.get_or_create(
                enrollment=enrollment, 
                defaults={'total_fee': enrollment.course.price}
            )
            enrollment_data.append({
                'enrollment': enrollment,
                'financial_record': record
            })
            
        context['enrollment_data'] = enrollment_data
        return context

class StudentDeleteView(ManagerRequiredMixin, DeleteView):
    model = User
    template_name = 'management/student_confirm_delete.html'
    success_url = reverse_lazy('management:student_list')
    context_object_name = 'student'
    
    def get_queryset(self):
        return User.objects.filter(is_student=True)

# Financial
@login_required
def financial_dashboard(request):
    if not is_manager(request.user):
        return redirect('management:dashboard')
        
    records = FinancialRecord.objects.all()
    
    # Calculate summaries
    total_income = Payment.objects.aggregate(Sum('amount'))['amount__sum'] or 0
    total_fee_sum = FinancialRecord.objects.aggregate(Sum('total_fee'))['total_fee__sum'] or 0
    total_debt = total_fee_sum - total_income
    total_transactions = Payment.objects.count()
    
    recent_payments = Payment.objects.order_by('-date')[:10]
    
    context = {
        'records': records,
        'total_income': total_income,
        'total_debt': total_debt,
        'total_transactions': total_transactions,
        'recent_payments': recent_payments,
    }
    return render(request, 'management/financial_dashboard.html', context)

@login_required
def financial_record_detail(request, enrollment_id):
    enrollment = get_object_or_404(Enrollment, id=enrollment_id)
    # Get or create
    record, created = FinancialRecord.objects.get_or_create(enrollment=enrollment, defaults={'total_fee': enrollment.course.price})
    return render(request, 'management/financial_record_detail.html', {'record': record})

@login_required
def add_payment(request, record_id):
    if not is_manager(request.user):
        return redirect('management:dashboard')
        
    financial_record = get_object_or_404(FinancialRecord, id=record_id)
    
    if request.method == 'POST':
        amount = request.POST.get('amount')
        date = request.POST.get('date')
        payment_type = request.POST.get('payment_type')
        description = request.POST.get('description')
        receipt = request.FILES.get('receipt')
        
        if amount:
            Payment.objects.create(
                financial_record=financial_record,
                amount=amount,
                date=date if date else timezone.now().date(),
                payment_type=payment_type,
                description=description,
                receipt=receipt
            )
            messages.success(request, 'پرداخت با موفقیت ثبت شد.')
            return redirect('management:student_detail', pk=financial_record.enrollment.student.pk)
            
    return render(request, 'management/payment_form.html', {'financial_record': financial_record})

@login_required
def add_transaction(request):
    if not is_manager(request.user):
        return redirect('management:dashboard')
    
    if request.method == 'POST':
        student_id = request.POST.get('student')
        course_id = request.POST.get('course')
        amount = request.POST.get('amount')
        date = request.POST.get('date')
        payment_type = request.POST.get('payment_type')
        description = request.POST.get('description')
        receipt = request.FILES.get('receipt')
        
        if student_id and course_id and amount:
            student = get_object_or_404(User, id=student_id)
            course = get_object_or_404(Course, id=course_id)
            
            # Check or create enrollment
            enrollment, created_enrollment = Enrollment.objects.get_or_create(
                student=student,
                course=course
            )
            
            # Ensure student status is updated if they were just a site user
            if not student.is_student:
                student.is_student = True
                student.save()
            
            # Get or create financial record
            financial_record, created_record = FinancialRecord.objects.get_or_create(
                enrollment=enrollment,
                defaults={'total_fee': course.price}
            )
            
            # Create payment
            Payment.objects.create(
                financial_record=financial_record,
                amount=amount,
                date=date if date else timezone.now().date(),
                payment_type=payment_type,
                description=description,
                receipt=receipt
            )
            
            messages.success(request, 'تراکنش با موفقیت ثبت شد.')
            return redirect('management:financial_dashboard')
            
    students = User.objects.filter(is_staff=False, is_superuser=False, is_teacher=False)
    courses = Course.objects.all()
    
    return render(request, 'management/transaction_form.html', {
        'students': students, 
        'courses': courses,
        'payment_types': Payment.PAYMENT_TYPES
    })

# Library
class LibraryListView(ListView):
    model = LibraryResource
    template_name = 'management/library_list.html'
    context_object_name = 'resources'

class LibraryCreateView(CreateView):
    model = LibraryResource
    template_name = 'management/library_form.html'
    fields = ['title', 'file', 'description']
    success_url = reverse_lazy('management:library_list')

    def form_valid(self, form):
        form.instance.uploaded_by = self.request.user
        return super().form_valid(form)

# Messages
class MessageListView(ListView):
    model = Message
    template_name = 'management/message_list.html'
    context_object_name = 'received_messages'

    def get_queryset(self):
        return Message.objects.filter(Q(recipient=self.request.user) | Q(recipient__isnull=True)).order_by('-created_at')

    def get(self, request, *args, **kwargs):
        response = super().get(request, *args, **kwargs)
        if request.user.is_authenticated:
            # Mark direct messages as read
            Message.objects.filter(recipient=request.user, is_read=False).update(is_read=True)
            
            # Mark public messages as read
            public_messages = Message.objects.filter(recipient__isnull=True).exclude(read_statuses__user=request.user)
            new_statuses = [MessageReadStatus(user=request.user, message=msg) for msg in public_messages]
            MessageReadStatus.objects.bulk_create(new_statuses, ignore_conflicts=True)
        return response

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sent_messages'] = Message.objects.filter(sender=self.request.user).order_by('-created_at')
        return context

class MessageCreateView(ManagerRequiredMixin, CreateView):
    model = Message
    template_name = 'management/message_form.html'
    fields = ['subject', 'body']
    success_url = reverse_lazy('management:message_list')

    def form_valid(self, form):
        form.instance.sender = self.request.user
        form.instance.recipient = None  # Public message
        return super().form_valid(form)

# Site Users
class SiteUserListView(ManagerRequiredMixin, ListView):
    model = User
    template_name = 'management/site_user_list.html'
    context_object_name = 'users'

    def get_queryset(self):
        return User.objects.filter(is_student=False, is_teacher=False, is_staff=False, is_superuser=False)

# Courses
class CourseListView(TeacherOrManagerRequiredMixin, ListView):
    model = Course
    template_name = 'management/course_list.html'
    context_object_name = 'courses'

    def get_queryset(self):
        user = self.request.user
        if is_manager(user):
            return Course.objects.all()
        elif getattr(user, 'is_teacher', False):
            return Course.objects.filter(teacher=user)
        return Course.objects.none()

class CourseCreateView(ManagerRequiredMixin, CreateView):
    model = Course
    template_name = 'management/course_form.html'
    fields = ['title', 'teacher', 'price', 'days', 'time', 'description', 'image']
    success_url = reverse_lazy('management:course_list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['teachers'] = User.objects.filter(is_teacher=True)
        return context

class CourseDetailView(TeacherOrManagerRequiredMixin, DetailView):
    model = Course
    template_name = 'management/course_detail.html'
    context_object_name = 'course'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['enrollments'] = Enrollment.objects.filter(course=self.object)
        if is_manager(self.request.user):
            context['all_students'] = User.objects.filter(is_student=True).exclude(enrollment__course=self.object)
        return context

@login_required
def add_student_to_course(request, course_id):
    if not is_manager(request.user):
        return redirect('management:dashboard')
        
    course = get_object_or_404(Course, id=course_id)
    
    if request.method == 'POST':
        student_id = request.POST.get('student')
        if student_id:
            student = get_object_or_404(User, id=student_id, is_student=True)
            Enrollment.objects.create(student=student, course=course)
            messages.success(request, f'هنرجو {student.get_full_name()} با موفقیت به کلاس اضافه شد.')
            
    return redirect('management:course_detail', pk=course_id)

# --- Attendance Views ---

class CourseAttendanceView(TeacherOrManagerRequiredMixin, ListView):
    model = AttendanceSession
    template_name = 'management/attendance_list.html'
    context_object_name = 'sessions'

    def get_queryset(self):
        self.course = get_object_or_404(Course, pk=self.kwargs['course_id'])
        # Security check
        if not is_manager(self.request.user) and self.course.teacher != self.request.user:
            return AttendanceSession.objects.none()
        return AttendanceSession.objects.filter(course=self.course).annotate(
            present_count=Count('records', filter=Q(records__status='present')),
            absent_count=Count('records', filter=Q(records__status='absent')),
            late_count=Count('records', filter=Q(records__status='late'))
        )

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['course'] = self.course
        return context

class AttendanceSessionCreateView(TeacherOrManagerRequiredMixin, CreateView):
    model = AttendanceSession
    fields = ['date']
    template_name = 'management/attendance_session_form.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['course'] = get_object_or_404(Course, pk=self.kwargs['course_id'])
        return context

    def form_valid(self, form):
        course = get_object_or_404(Course, pk=self.kwargs['course_id'])
        if not is_manager(self.request.user) and course.teacher != self.request.user:
             return redirect('home') # Or raise 403
        
        form.instance.course = course
        try:
            return super().form_valid(form)
        except:
            # Handle duplicate date error
            form.add_error('date', 'جلسه‌ای با این تاریخ قبلاً ثبت شده است.')
            return self.form_invalid(form)

    def get_success_url(self):
        return reverse_lazy('management:attendance_take', kwargs={'course_id': self.kwargs['course_id'], 'session_id': self.object.pk})

@login_required
def take_attendance(request, course_id, session_id):
    course = get_object_or_404(Course, pk=course_id)
    session = get_object_or_404(AttendanceSession, pk=session_id, course=course)
    
    if not is_manager(request.user) and course.teacher != request.user:
        return redirect('home')
        
    # Get all students enrolled
    enrollments = Enrollment.objects.filter(course=course).select_related('student')
    students = [e.student for e in enrollments]
    
    # Prepare records
    # Ensure a record exists for each student for this session
    for student in students:
        AttendanceRecord.objects.get_or_create(session=session, student=student)
        
    AttendanceFormSet = modelformset_factory(AttendanceRecord, fields=('student', 'status', 'note'), extra=0)
    
    if request.method == 'POST':
        formset = AttendanceFormSet(request.POST, queryset=AttendanceRecord.objects.filter(session=session))
        if formset.is_valid():
            formset.save()
            messages.success(request, 'لیست حضور و غیاب با موفقیت ثبت شد.')
            return redirect('management:attendance_list', course_id=course.id)
    else:
        # We want to display student name, but modelformset usually just shows the select box.
        # We can handle this in template by iterating over formset and accessing instance.student
        formset = AttendanceFormSet(queryset=AttendanceRecord.objects.filter(session=session))
        
    return render(request, 'management/attendance_take.html', {
        'course': course,
        'session': session,
        'formset': formset
    })

# --- Exam Views ---

class CourseExamListView(TeacherOrManagerRequiredMixin, ListView):
    model = Exam
    template_name = 'management/exam_list.html'
    context_object_name = 'exams'
    
    def get_queryset(self):
        self.course = get_object_or_404(Course, pk=self.kwargs['course_id'])
        if not is_manager(self.request.user) and self.course.teacher != self.request.user:
            return Exam.objects.none()
        return Exam.objects.filter(course=self.course)
        
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['course'] = self.course
        return context

class ExamCreateView(TeacherOrManagerRequiredMixin, CreateView):
    model = Exam
    fields = ['title', 'date', 'max_score', 'description']
    template_name = 'management/exam_form.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['course'] = get_object_or_404(Course, pk=self.kwargs['course_id'])
        return context

    def form_valid(self, form):
        course = get_object_or_404(Course, pk=self.kwargs['course_id'])
        if not is_manager(self.request.user) and course.teacher != self.request.user:
             return redirect('home')
        form.instance.course = course
        return super().form_valid(form)
        
    def get_success_url(self):
        return reverse_lazy('management:exam_list', kwargs={'course_id': self.kwargs['course_id']})

@login_required
def enter_grades(request, course_id, exam_id):
    course = get_object_or_404(Course, pk=course_id)
    exam = get_object_or_404(Exam, pk=exam_id, course=course)
    
    if not is_manager(request.user) and course.teacher != request.user:
        return redirect('home')
        
    enrollments = Enrollment.objects.filter(course=course).select_related('student')
    students = [e.student for e in enrollments]
    
    for student in students:
        ExamGrade.objects.get_or_create(exam=exam, student=student, defaults={'score': 0})
        
    GradeFormSet = modelformset_factory(ExamGrade, fields=('student', 'score', 'feedback'), extra=0)
    
    if request.method == 'POST':
        formset = GradeFormSet(request.POST, queryset=ExamGrade.objects.filter(exam=exam))
        if formset.is_valid():
            formset.save()
            messages.success(request, 'نمرات با موفقیت ثبت شدند.')
            return redirect('management:exam_list', course_id=course.id)
    else:
        formset = GradeFormSet(queryset=ExamGrade.objects.filter(exam=exam))
        
    return render(request, 'management/enter_grades.html', {
        'course': course,
        'exam': exam,
        'formset': formset
    })
