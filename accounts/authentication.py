"""
Custom DRF authentication class that verifies Firebase ID tokens.

Flow:
1. Extracts the Bearer token from the Authorization header.
2. Calls firebase_admin.auth.verify_id_token() to verify signature & expiry.
3. Gets-or-creates a Django User with the matching firebase_uid.
4. Returns (user, None) so DRF attaches the user to request.user.
"""

import firebase_admin
from firebase_admin import auth as firebase_auth
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model

User = get_user_model()


class FirebaseAuthentication(BaseAuthentication):
    """Authenticate requests using Firebase ID tokens."""

    keyword = 'Bearer'

    def authenticate(self, request):
        auth_header = request.headers.get('Authorization', '')

        if not auth_header:
            return None

        parts = auth_header.split()

        if len(parts) != 2 or parts[0] != self.keyword:
            return None

        token = parts[1]

        try:
            if not firebase_admin._apps:
                raise AuthenticationFailed('Firebase Admin SDK is not initialized.')

            decoded_token = firebase_auth.verify_id_token(token)
            firebase_uid = decoded_token['uid']
            email = decoded_token.get('email', '')
            name = decoded_token.get('name', '')
            picture = decoded_token.get('picture', '')

            user, created = User.objects.get_or_create(
                firebase_uid=firebase_uid,
                defaults={
                    'email': email,
                    'username': email,
                    'display_name': name,
                    'avatar_url': picture,
                }
            )

            # Update display name / avatar if the user already exists but info changed
            if not created:
                updated = False
                if name and user.display_name != name:
                    user.display_name = name
                    updated = True
                if picture and user.avatar_url != picture:
                    user.avatar_url = picture
                    updated = True
                if email and user.email != email:
                    user.email = email
                    updated = True
                if updated:
                    user.save()

            return (user, None)

        except firebase_auth.InvalidIdTokenError:
            raise AuthenticationFailed('Invalid Firebase ID token.')
        except firebase_auth.ExpiredIdTokenError:
            raise AuthenticationFailed('Firebase ID token has expired.')
        except firebase_auth.RevokedIdTokenError:
            raise AuthenticationFailed('Firebase ID token has been revoked.')
        except Exception as e:
            raise AuthenticationFailed(f'Authentication failed: {str(e)}')

    def authenticate_header(self, request):
        return self.keyword