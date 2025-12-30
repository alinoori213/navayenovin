from rest_framework import generics, permissions
from .models import SiteSetting
from .serializers import SiteSettingSerializer

class SiteSettingListView(generics.ListAPIView):
    queryset = SiteSetting.objects.all()
    serializer_class = SiteSettingSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None
