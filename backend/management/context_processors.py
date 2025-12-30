from .models import Message, MessageReadStatus
from django.db.models import Q

def unread_messages(request):
    if not request.user.is_authenticated:
        return {'unread_messages': 0}
    
    # Direct messages sent to the user that are unread
    direct_unread = Message.objects.filter(recipient=request.user, is_read=False).count()
    
    # Public messages that the user hasn't read yet
    # We exclude messages that have a read status for this user
    public_unread = Message.objects.filter(recipient__isnull=True).exclude(read_statuses__user=request.user).count()
    
    return {'unread_messages': direct_unread + public_unread}
