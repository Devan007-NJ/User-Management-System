from django.urls import path
from .views import ProfileView, ProfileImageUploadView

urlpatterns = [
    path('me/', ProfileView.as_view(), name='profile'),
    path('me/image/', ProfileImageUploadView.as_view(), name='profile-image'),
]