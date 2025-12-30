from django import forms
from .models import Survey, Question, Choice, TeacherSurvey, TeacherSurveyQuestion

# --- Generic Survey Forms ---

class SurveyForm(forms.ModelForm):
    class Meta:
        model = Survey
        fields = ['title', 'description', 'is_active']
        widgets = {
            'description': forms.Textarea(attrs={'rows': 3}),
        }

class QuestionForm(forms.ModelForm):
    # Custom fields for choices
    option1 = forms.CharField(label="گزینه ۱", max_length=200, required=True)
    option2 = forms.CharField(label="گزینه ۲", max_length=200, required=True)
    option3 = forms.CharField(label="گزینه ۳", max_length=200, required=True)
    option4 = forms.CharField(label="گزینه ۴", max_length=200, required=True)

    class Meta:
        model = Question
        fields = ['text']
        widgets = {
            'text': forms.Textarea(attrs={'rows': 2, 'placeholder': 'متن سوال را وارد کنید...'}),
        }

    def save(self, commit=True):
        question = super().save(commit=False)
        if commit:
            question.save()
            # Create choices
            Choice.objects.create(question=question, text=self.cleaned_data['option1'])
            Choice.objects.create(question=question, text=self.cleaned_data['option2'])
            Choice.objects.create(question=question, text=self.cleaned_data['option3'])
            Choice.objects.create(question=question, text=self.cleaned_data['option4'])
        return question

# --- Teacher Survey Forms ---

class TeacherSurveyForm(forms.ModelForm):
    class Meta:
        model = TeacherSurvey
        fields = ['teacher', 'title', 'is_active']
        widgets = {
            'teacher': forms.Select(attrs={'class': 'form-select'}),
            'title': forms.TextInput(attrs={'class': 'form-control'}),
        }

class TeacherSurveyQuestionForm(forms.ModelForm):
    class Meta:
        model = TeacherSurveyQuestion
        fields = ['text']
        widgets = {
            'text': forms.Textarea(attrs={'rows': 2, 'placeholder': 'متن سوال را وارد کنید...', 'class': 'form-control'}),
        }
