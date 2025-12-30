from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ['username', 'email', 'first_name', 'last_name', 'is_staff', 'is_teacher', 'is_student']
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('bio', 'phone_number', 'profile_picture', 'is_teacher', 'is_student')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Custom Fields', {'fields': ('bio', 'phone_number', 'profile_picture', 'is_teacher', 'is_student')}),
    )

admin.site.register(User, CustomUserAdmin)
