from django.urls import path
from . import views

app_name = 'surveys'

urlpatterns = [
    # Manager URLs
    path('list/', views.SurveyListView.as_view(), name='survey_list'),
    path('create/', views.SurveyCreateView.as_view(), name='survey_create'),
    path('<int:pk>/', views.SurveyDetailView.as_view(), name='survey_detail'),
    path('<int:pk>/delete/', views.SurveyDeleteView.as_view(), name='survey_delete'),
    path('<int:survey_pk>/questions/add/', views.QuestionCreateView.as_view(), name='question_create'),
    
    # Teacher Surveys
    path('teacher/create/', views.TeacherSurveyCreateView.as_view(), name='teacher_survey_create'),
    path('teacher/<int:pk>/', views.TeacherSurveyDetailView.as_view(), name='teacher_survey_detail'),
    path('teacher/<int:pk>/delete/', views.TeacherSurveyDeleteView.as_view(), name='teacher_survey_delete'),
    path('teacher/<int:survey_pk>/questions/add/', views.TeacherSurveyQuestionCreateView.as_view(), name='teacher_question_create'),
    
    # Public URLs
    path('s/done/', views.SurveyThankYouView.as_view(), name='survey_thank_you'),
    path('s/<uuid:slug>/', views.SurveyPublicView.as_view(), name='survey_public'),
    path('t/<uuid:slug>/', views.TeacherSurveyPublicView.as_view(), name='teacher_survey_public'),
]
