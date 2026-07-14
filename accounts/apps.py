from pathlib import Path

import firebase_admin
from firebase_admin import credentials
from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        if firebase_admin._apps:
            return

        service_account_file = Path(__file__).resolve().parent.parent / 'firebase-service-account.json'
        if service_account_file.exists():
            firebase_admin.initialize_app(credentials.Certificate(str(service_account_file)))