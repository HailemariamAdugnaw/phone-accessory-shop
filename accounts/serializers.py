from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'display_name', 'avatar_url', 'firebase_uid', 'date_joined')
        read_only_fields = ('id', 'firebase_uid', 'date_joined')