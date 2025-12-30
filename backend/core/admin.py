from django.contrib import admin
from .models import SiteSetting

@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = ('key', 'description', 'value_preview')
    search_fields = ('key', 'description', 'value')
    
    def value_preview(self, obj):
        if obj.value:
            return obj.value[:50] + "..." if len(obj.value) > 50 else obj.value
        return "-"
