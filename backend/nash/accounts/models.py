from django.db import models

class ChatMessage(models.Model):
    room = models.CharField(max_length=100)
    sender = models.IntegerField()
    content = models.TextField()   # ✅ ONLY content
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.room} - {self.sender}"
from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)

    def __str__(self):
        return self.user.username
class Group(models.Model):
    name = models.CharField(max_length=100)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    members = models.ManyToManyField(User, related_name="chat_groups")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
