from django.db import models

class SiteSetting(models.Model):
    key = models.CharField(max_length=100, unique=True, help_text="Key for frontend reference (e.g., home_hero_title)")
    value = models.TextField(blank=True, null=True, help_text="Text content")
    image = models.ImageField(upload_to='site_images/', blank=True, null=True, help_text="Image content (optional)")
    description = models.CharField(max_length=255, blank=True, help_text="Description for admin to understand what this setting does")

    def __str__(self):
        return f"{self.description} ({self.key})"
