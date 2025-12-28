from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.views.decorators.csrf import csrf_exempt

from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response

from .models import ChatMessage, Profile, Group


# ======================
# AUTH
# ======================

@api_view(["POST"])
@renderer_classes([JSONRenderer])
def signup(request):
    name = request.data.get("name")
    email = request.data.get("email")
    password = request.data.get("password")

    if not all([name, email, password]):
        return Response({"error": "All fields required"}, status=400)

    if User.objects.filter(username=email).exists():
        return Response({"error": "User already exists"}, status=400)

    user = User.objects.create_user(
        username=email,
        email=email,
        password=password,
        first_name=name,
    )

    Profile.objects.create(user=user)

    return Response({
        "id": user.id,
        "name": user.first_name,
        "email": user.email,
    }, status=201)


@api_view(["POST"])
@renderer_classes([JSONRenderer])
def login(request):
    email = request.data.get("email")
    password = request.data.get("password")

    user = authenticate(username=email, password=password)
    if not user:
        return Response({"error": "Invalid credentials"}, status=401)

    return Response({
        "id": user.id,
        "name": user.first_name,
        "email": user.email,
    })


# ======================
# USERS (SIDEBAR)
# ======================

@api_view(["GET"])
@renderer_classes([JSONRenderer])
def get_users(request):
    users = User.objects.all()
    data = []

    for u in users:
        profile = Profile.objects.filter(user=u).first()
        avatar = (
            request.build_absolute_uri(profile.avatar.url)
            if profile and profile.avatar else None
        )

        data.append({
            "id": u.id,
            "name": u.first_name,
            "email": u.email,
            "avatar": avatar,
        })

    return Response(data)


# ======================
# CHAT HISTORY
# ======================

@api_view(["GET"])
@renderer_classes([JSONRenderer])
def get_chat_messages(request, room):
    messages = ChatMessage.objects.filter(room=room).order_by("timestamp")
    return Response([
        {
            "id": msg.id,
            "message": msg.content,
            "sender": msg.sender,
        } for msg in messages
    ])


# ======================
# PROFILE (ONLY ME)
# ======================

@api_view(["GET"])
@renderer_classes([JSONRenderer])
def get_profile(request):
    user_id = request.GET.get("user_id")
    profile = Profile.objects.get(user_id=user_id)

    avatar = (
        request.build_absolute_uri(profile.avatar.url)
        if profile.avatar else None
    )

    return Response({
        "name": profile.user.first_name,
        "email": profile.user.email,
        "bio": profile.bio,
        "avatar": avatar
    })


@csrf_exempt
@api_view(["POST"])
@renderer_classes([JSONRenderer])
def update_profile(request):
    user_id = request.POST.get("user_id")
    profile, _ = Profile.objects.get_or_create(user_id=user_id)

    name = request.POST.get("name")
    bio = request.POST.get("bio")
    avatar = request.FILES.get("avatar")

    if name:
        profile.user.first_name = name
        profile.user.save()

    if bio is not None:
        profile.bio = bio

    if avatar:
        profile.avatar = avatar

    profile.save()
    return Response({"success": True})


# ======================
# FILE UPLOAD (CHAT MEDIA)
# ======================

@csrf_exempt
@api_view(["POST"])
@renderer_classes([JSONRenderer])
def upload_file(request):
    if "file" not in request.FILES:
        return Response({"error": "No file"}, status=400)

    file = request.FILES["file"]
    fs = FileSystemStorage(location=settings.MEDIA_ROOT)
    filename = fs.save(file.name, file)

    return Response({
        "url": request.build_absolute_uri(settings.MEDIA_URL + filename)
    }, status=201)


# ======================
# GROUPS
# ======================

@api_view(["POST"])
@renderer_classes([JSONRenderer])
def create_group(request):
    name = request.data.get("name")
    user_id = request.data.get("user_id")

    if not name or not user_id:
        return Response({"error": "Missing fields"}, status=400)

    creator = User.objects.get(id=user_id)

    group = Group.objects.create(
        name=name,
        created_by=creator
    )
    group.members.add(creator)

    return Response({
        "id": group.id,
        "name": group.name
    }, status=201)


@api_view(["GET"])
@renderer_classes([JSONRenderer])
def get_groups(request):
    user_id = request.GET.get("user_id")

    groups = Group.objects.all()

    return Response([
        {
            "id": g.id,
            "name": g.name,
            "joined": g.members.filter(id=user_id).exists()
        } for g in groups
    ])


@api_view(["POST"])
@renderer_classes([JSONRenderer])
def join_group(request):
    group_id = request.data.get("group_id")
    user_id = request.data.get("user_id")

    group = Group.objects.get(id=group_id)
    user = User.objects.get(id=user_id)

    group.members.add(user)

    return Response({"success": True})
