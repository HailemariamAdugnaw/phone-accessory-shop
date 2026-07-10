from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user that links to Firebase Authentication via firebase_uid."""

    firebase_uid = models.CharField(
        max_length=128,
        unique=True,
        null=True,
        blank=True,
        db_index=True,
        help_text='Firebase Authentication UID'
    )
    display_name = models.CharField(max_length=150, blank=True)
    avatar_url = models.URLField(blank=True)

    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True, null=True, blank=True)

    USERNAME_FIELD = 'email'
    
    # FIX: Adding username here tells 'createsuperuser' to ask for it in the terminal
    REQUIRED_FIELDS = ['username']  

    def __str__(self):
        return self.email

    @property
    def full_name(self):
        return self.display_name or self.get_full_name() or self.email