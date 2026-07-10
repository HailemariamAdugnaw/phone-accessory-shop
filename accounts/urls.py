from django.urls import path
from .views import VerifyTokenView, UserProfileView

urlpatterns = [
    path('verify/', VerifyTokenView.as_view(), name='verify-token'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
]