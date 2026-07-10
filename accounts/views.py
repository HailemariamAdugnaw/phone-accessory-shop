"""Authentication views — verify Firebase token and return user profile."""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializers import UserSerializer


class VerifyTokenView(APIView):
    """
    POST /api/auth/verify/
    Body: { "id_token": "<firebase_id_token>" }
    Returns: user profile if token is valid.
    """

    def post(self, request):
        from .authentication import FirebaseAuthentication
        import firebase_admin
        from firebase_admin import auth as firebase_auth

        id_token = request.data.get('id_token')
        if not id_token:
            return Response(
                {'error': 'id_token is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            decoded = firebase_auth.verify_id_token(id_token)
            firebase_uid = decoded['uid']
            email = decoded.get('email', '')
            name = decoded.get('name', '')
            picture = decoded.get('picture', '')

            from django.contrib.auth import get_user_model
            User = get_user_model()

            user, created = User.objects.get_or_create(
                firebase_uid=firebase_uid,
                defaults={
                    'email': email,
                    'username': email,
                    'display_name': name,
                    'avatar_url': picture,
                }
            )

            serializer = UserSerializer(user)
            return Response({
                'message': 'Token verified successfully.' if not created else 'User created.',
                'user': serializer.data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': f'Token verification failed: {str(e)}'},
                status=status.HTTP_401_UNAUTHORIZED
            )


class UserProfileView(APIView):
    """
    GET /api/auth/profile/
    Requires Firebase authentication.
    Returns the authenticated user's profile.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        """Update display_name."""
        user = request.user
        display_name = request.data.get('display_name')
        if display_name:
            user.display_name = display_name
            user.save()
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)