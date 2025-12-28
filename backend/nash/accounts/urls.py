from django.urls import path
from . import views

urlpatterns = [
    # AUTH
    path("signup/", views.signup),
    path("login/", views.login),

    # USERS & CHAT
    path("users/", views.get_users),
    path("messages/<str:room>/", views.get_chat_messages),

    # PROFILE
    path("profile/", views.get_profile),
    path("profile/update/", views.update_profile),

    # FILE UPLOAD
    path("upload/", views.upload_file),

    # GROUPS
    path("groups/", views.get_groups),
    path("groups/create/", views.create_group),
    path("groups/join/", views.join_group),
]
