from django.core.management.base import BaseCommand
from core.models import User


class Command(BaseCommand):
    help = 'Create default role-based users'

    def handle(self, *args, **kwargs):
        users_data = [
            {
                'username': 'admin',
                'email': 'admin@example.com',
                'password': 'Admin123@',
                'role': 'admin',
                'is_staff': True,
                'is_superuser': True,
            },
            {
                'username': 'purchaseuser',
                'email': 'purchase@example.com',
                'password': 'Purchase123@',
                'role': 'purchase',
                'is_staff': False,
                'is_superuser': False,
            },
            {
                'username': 'salesuser',
                'email': 'sales@example.com',
                'password': 'Sales123@',
                'role': 'sales',
                'is_staff': False,
                'is_superuser': False,
            },
            {
                'username': 'productionuser',
                'email': 'production@example.com',
                'password': 'Production123@',
                'role': 'production',
                'is_staff': False,
                'is_superuser': False,
            },
        ]

        for user_data in users_data:
            username = user_data['username']

            if User.objects.filter(username=username).exists():
                user = User.objects.get(username=username)
                user.email = user_data['email']
                user.role = user_data['role']
                user.is_staff = user_data['is_staff']
                user.is_superuser = user_data['is_superuser']
                user.set_password(user_data['password'])
                user.save()

                self.stdout.write(
                    self.style.WARNING(f'Updated existing user: {username} ({user.role})')
                )
            else:
                user = User.objects.create_user(
                    username=user_data['username'],
                    email=user_data['email'],
                    password=user_data['password'],
                )
                user.role = user_data['role']
                user.is_staff = user_data['is_staff']
                user.is_superuser = user_data['is_superuser']
                user.save()

                self.stdout.write(
                    self.style.SUCCESS(f'Created user: {username} ({user.role})')
                )

        self.stdout.write(self.style.SUCCESS('All role-based users are ready.'))