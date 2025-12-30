from django.urls import path
from .views import SiteSettingListView

urlpatterns = [
    path('settings/', SiteSettingListView.as_view(), name='site-settings'),
]
