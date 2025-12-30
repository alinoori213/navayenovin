import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from accounts.models import User

# Find users who are students but have no enrollments
# Assuming enrollment_set is the related name
count = User.objects.filter(is_student=True, enrollment__isnull=True).update(is_student=False)
print(f"Updated {count} users from student to site user.")
