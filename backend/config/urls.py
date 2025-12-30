from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from accounts.views import RegisterView, LoginView, LogoutView, UserDetailView, TeacherListView, TeacherDetailView
from blog.views import PostViewSet, NewsViewSet, CategoryViewSet
from courses.views import CourseViewSet, EnrollmentViewSet
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'posts', PostViewSet)
router.register(r'news', NewsViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'enrollments', EnrollmentViewSet, basename='enrollment')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/register/', RegisterView.as_view(), name='register'),
    path('api/auth/login/', LoginView.as_view(), name='login'),
    path('api/auth/logout/', LogoutView.as_view(), name='logout'),
    path('api/auth/user/', UserDetailView.as_view(), name='user_detail'),
    path('api/teachers/', TeacherListView.as_view(), name='teacher_list'),
    path('api/teachers/<int:pk>/', TeacherDetailView.as_view(), name='teacher_detail'),
    path('api/core/', include('core.urls')),
    path('management/', include('management.urls')),
    path('surveys/', include('surveys.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
