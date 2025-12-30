from django.shortcuts import render, get_object_or_404, redirect
from django.views.generic import ListView, CreateView, DetailView, DeleteView, View
from django.urls import reverse_lazy, reverse
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.db.models import Count, Avg
from .models import Survey, Question, Choice, Response, Answer, TeacherSurvey, TeacherSurveyQuestion, TeacherSurveyResponse, TeacherSurveyAnswer
from .forms import SurveyForm, QuestionForm, TeacherSurveyForm, TeacherSurveyQuestionForm
from management.views import is_manager, is_teacher_or_manager

class ManagerRequiredMixin(LoginRequiredMixin, UserPassesTestMixin):
    def test_func(self):
        return is_manager(self.request.user)

class TeacherOwnerOrManagerRequiredMixin(LoginRequiredMixin, UserPassesTestMixin):
    def test_func(self):
        user = self.request.user
        if is_manager(user):
            return True
        # Check if user is the teacher owner of the survey
        # We need to get the object first, but test_func is called before get_object usually
        # But for DetailView, we can check self.get_object() inside dispatch or handle it here
        # However, UserPassesTestMixin runs test_func before get_object.
        # So we can't easily access the object here without fetching it manually.
        
        # A better approach for object-level permission is to override get_object or use a different mixin.
        # Let's try fetching the object manually using the PK from kwargs.
        pk = self.kwargs.get('pk')
        if pk:
            try:
                survey = TeacherSurvey.objects.get(pk=pk)
                return survey.teacher == user
            except TeacherSurvey.DoesNotExist:
                return False
        return False

# --- Manager Views (Generic) ---

class SurveyListView(ManagerRequiredMixin, ListView):
    model = Survey
    template_name = 'surveys/survey_list.html'
    context_object_name = 'surveys'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['teacher_surveys'] = TeacherSurvey.objects.all()
        return context

class SurveyCreateView(ManagerRequiredMixin, CreateView):
    model = Survey
    form_class = SurveyForm
    template_name = 'surveys/survey_form.html'
    
    def get_success_url(self):
        return reverse('surveys:survey_detail', kwargs={'pk': self.object.pk})

class SurveyDetailView(ManagerRequiredMixin, DetailView):
    model = Survey
    template_name = 'surveys/survey_detail.html'
    context_object_name = 'survey'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Stats logic
        questions = self.object.questions.all()
        stats = []
        for q in questions:
            choices = q.choices.annotate(vote_count=Count('answer'))
            total_votes = sum(c.vote_count for c in choices)
            stats.append({
                'question': q,
                'choices': choices,
                'total_votes': total_votes
            })
        context['stats'] = stats
        context['response_count'] = self.object.responses.count()
        return context

class QuestionCreateView(ManagerRequiredMixin, CreateView):
    model = Question
    form_class = QuestionForm
    template_name = 'surveys/question_form.html'

    def form_valid(self, form):
        survey = get_object_or_404(Survey, pk=self.kwargs['survey_pk'])
        form.instance.survey = survey
        return super().form_valid(form)

    def get_success_url(self):
        return reverse('surveys:survey_detail', kwargs={'pk': self.kwargs['survey_pk']})
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['survey'] = get_object_or_404(Survey, pk=self.kwargs['survey_pk'])
        return context

class SurveyDeleteView(ManagerRequiredMixin, DeleteView):
    model = Survey
    template_name = 'surveys/survey_confirm_delete.html'
    success_url = reverse_lazy('surveys:survey_list')

# --- Manager Views (Teacher Survey) ---

class TeacherSurveyCreateView(ManagerRequiredMixin, CreateView):
    model = TeacherSurvey
    form_class = TeacherSurveyForm
    template_name = 'surveys/teacher_survey_form.html'
    
    def get_success_url(self):
        return reverse('surveys:teacher_survey_detail', kwargs={'pk': self.object.pk})

class TeacherSurveyDetailView(TeacherOwnerOrManagerRequiredMixin, DetailView):
    model = TeacherSurvey
    template_name = 'surveys/teacher_survey_detail.html'
    context_object_name = 'survey'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        questions = self.object.questions.all()
        
        # Calculate stats for each question (average score)
        stats = []
        total_survey_score = 0
        questions_with_answers = 0

        for q in questions:
            avg_score = q.answers.aggregate(Avg('score'))['score__avg']
            stats.append({
                'question': q,
                'avg_score': avg_score or 0
            })
            if avg_score:
                total_survey_score += avg_score
                questions_with_answers += 1
        
        context['stats'] = stats
        context['response_count'] = self.object.responses.count()
        context['total_average'] = (total_survey_score / questions_with_answers) if questions_with_answers > 0 else 0
        return context

class TeacherSurveyQuestionCreateView(ManagerRequiredMixin, CreateView):
    model = TeacherSurveyQuestion
    form_class = TeacherSurveyQuestionForm
    template_name = 'surveys/teacher_question_form.html'

    def form_valid(self, form):
        survey = get_object_or_404(TeacherSurvey, pk=self.kwargs['survey_pk'])
        form.instance.survey = survey
        return super().form_valid(form)

    def get_success_url(self):
        return reverse('surveys:teacher_survey_detail', kwargs={'pk': self.kwargs['survey_pk']})
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['survey'] = get_object_or_404(TeacherSurvey, pk=self.kwargs['survey_pk'])
        return context

class TeacherSurveyDeleteView(ManagerRequiredMixin, DeleteView):
    model = TeacherSurvey
    template_name = 'surveys/teacher_survey_confirm_delete.html'
    success_url = reverse_lazy('surveys:survey_list')

# --- Public Views ---

class BasePublicSurveyView(View):
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

class SurveyPublicView(BasePublicSurveyView):
    def get(self, request, slug):
        survey = get_object_or_404(Survey, slug=slug, is_active=True)
        return render(request, 'surveys/survey_public.html', {'survey': survey})

    def post(self, request, slug):
        survey = get_object_or_404(Survey, slug=slug, is_active=True)
        
        response = Response.objects.create(
            survey=survey,
            ip_address=self.get_client_ip(request)
        )

        for question in survey.questions.all():
            choice_id = request.POST.get(f'question_{question.id}')
            if choice_id:
                choice = get_object_or_404(Choice, id=choice_id)
                Answer.objects.create(
                    response=response,
                    question=question,
                    choice=choice
                )
        
        return redirect('surveys:survey_thank_you')

class TeacherSurveyPublicView(BasePublicSurveyView):
    def get(self, request, slug):
        survey = get_object_or_404(TeacherSurvey, slug=slug, is_active=True)
        return render(request, 'surveys/teacher_survey_public.html', {'survey': survey})

    def post(self, request, slug):
        survey = get_object_or_404(TeacherSurvey, slug=slug, is_active=True)
        
        response = TeacherSurveyResponse.objects.create(
            survey=survey,
            ip_address=self.get_client_ip(request)
        )

        for question in survey.questions.all():
            score = request.POST.get(f'question_{question.id}')
            if score:
                TeacherSurveyAnswer.objects.create(
                    response=response,
                    question=question,
                    score=int(score)
                )
        
        return redirect('surveys:survey_thank_you')

class SurveyThankYouView(View):
    def get(self, request):
        return render(request, 'surveys/survey_thank_you.html')
