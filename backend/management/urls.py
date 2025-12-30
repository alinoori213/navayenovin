from django.urls import path
from . import views

app_name = 'management'

urlpatterns = [
    # Dashboard
    path('', views.dashboard, name='dashboard'),
    
    # Auth
    path('login/', views.CustomLoginView.as_view(), name='login'),
    path('logout/', views.custom_logout, name='logout'),

    # Teachers
    path('teachers/', views.TeacherListView.as_view(), name='teacher_list'),
    path('teachers/add/', views.TeacherCreateView.as_view(), name='teacher_add'),
    path('teachers/<int:pk>/edit/', views.TeacherUpdateView.as_view(), name='teacher_edit'),
    path('teachers/<int:pk>/', views.TeacherDetailView.as_view(), name='teacher_detail'),
    path('teachers/<int:pk>/delete/', views.TeacherDeleteView.as_view(), name='teacher_delete'),
    path('teachers/<int:pk>/schedule/', views.teacher_schedule, name='teacher_schedule'),

    # Students
    path('students/', views.StudentListView.as_view(), name='student_list'),
    path('students/add/', views.StudentCreateView.as_view(), name='student_add'),
    path('students/<int:pk>/edit/', views.StudentUpdateView.as_view(), name='student_edit'),
    path('students/<int:pk>/', views.StudentDetailView.as_view(), name='student_detail'),
    path('students/<int:pk>/delete/', views.StudentDeleteView.as_view(), name='student_delete'),

    # Financial
    path('financial/', views.financial_dashboard, name='financial_dashboard'),
    path('financial/record/<int:enrollment_id>/', views.financial_record_detail, name='financial_record_detail'),
    path('financial/payment/add/<int:record_id>/', views.add_payment, name='add_payment'),
    path('financial/transaction/add/', views.add_transaction, name='add_transaction'),

    # Library
    path('library/', views.LibraryListView.as_view(), name='library_list'),
    path('library/add/', views.LibraryCreateView.as_view(), name='library_add'),

    # Messages
    path('messages/', views.MessageListView.as_view(), name='message_list'),
    path('messages/send/', views.MessageCreateView.as_view(), name='message_send'),

    # Site Users
    path('users/', views.SiteUserListView.as_view(), name='site_user_list'),

    # Courses
    path('courses/', views.CourseListView.as_view(), name='course_list'),
    path('courses/add/', views.CourseCreateView.as_view(), name='course_add'),
    path('courses/<int:pk>/', views.CourseDetailView.as_view(), name='course_detail'),
    path('courses/<int:course_id>/add_student/', views.add_student_to_course, name='course_add_student'),

    # Attendance
    path('courses/<int:course_id>/attendance/', views.CourseAttendanceView.as_view(), name='attendance_list'),
    path('courses/<int:course_id>/attendance/create/', views.AttendanceSessionCreateView.as_view(), name='attendance_create'),
    path('courses/<int:course_id>/attendance/<int:session_id>/', views.take_attendance, name='attendance_take'),

    # Exams
    path('courses/<int:course_id>/exams/', views.CourseExamListView.as_view(), name='exam_list'),
    path('courses/<int:course_id>/exams/create/', views.ExamCreateView.as_view(), name='exam_create'),
    path('courses/<int:course_id>/exams/<int:exam_id>/grades/', views.enter_grades, name='enter_grades'),
]
