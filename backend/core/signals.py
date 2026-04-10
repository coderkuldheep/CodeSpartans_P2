from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Sales, Production

@receiver(post_save, sender=Sales)
def create_production(sender, instance, created, **kwargs):
    if created:
        Production.objects.create(
            product=instance.product,
            quantity=instance.quantity,
            size=instance.size,
            quality=instance.quality,
            requested_date=instance.dispatch_date
        )