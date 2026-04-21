from django.core.management.base import BaseCommand
from core.models import Product


class Command(BaseCommand):
    help = 'Create default products'

    def handle(self, *args, **kwargs):

        products_data = [
            {"name": "Steel Rod", "size": "10mm", "quality": "High"},
            {"name": "Steel Rod", "size": "12mm", "quality": "Medium"},
            {"name": "Steel Sheet", "size": "5mm", "quality": "High"},
            {"name": "Aluminium Sheet", "size": "3mm", "quality": "Premium"},
            {"name": "Copper Wire", "size": "2mm", "quality": "Standard"},
        ]

        for product in products_data:
            obj, created = Product.objects.get_or_create(
                name=product["name"],
                size=product["size"],
                quality=product["quality"],
            )

            if created:
                self.stdout.write(
                    self.style.SUCCESS(
                        f"Created product: {obj.name} ({obj.size}, {obj.quality})"
                    )
                )
            else:
                self.stdout.write(
                    self.style.WARNING(
                        f"Already exists: {obj.name} ({obj.size}, {obj.quality})"
                    )
                )

        self.stdout.write(self.style.SUCCESS("All products seeded successfully."))