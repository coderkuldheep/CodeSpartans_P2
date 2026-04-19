from django.db import models
from django.contrib.auth.models import AbstractUser

# ---------------- USER ----------------
class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('purchase', 'Purchase'),
        ('sales', 'Sales'),
        ('production', 'Production'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='admin')

    def __str__(self):
        return self.username


# ---------------- SUPPLIER ----------------
class Supplier(models.Model):
    name = models.CharField(max_length=100)
    contact = models.CharField(max_length=20)
    address = models.TextField()

    def __str__(self):
        return self.name


# ---------------- PRODUCT ----------------
class Product(models.Model):
    name = models.CharField(max_length=100)
    size = models.CharField(max_length=50)
    quality = models.CharField(max_length=50)

    def __str__(self):
        return self.name


# ---------------- PURCHASE ----------------
class Purchase(models.Model):
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    total_rate = models.FloatField()
    total_quantity = models.IntegerField()
    date_received = models.DateField()

    discount = models.FloatField(default=0, blank=True)
    advance_paid = models.FloatField(default=0, blank=True)
    balance_amount = models.FloatField(default=0, blank=True)

    vehicle_no = models.CharField(max_length=20, blank=True, default='')
    driver_no = models.CharField(max_length=20, blank=True, default='')

    dispatch_date = models.DateField(null=True, blank=True)
    receive_date = models.DateField(null=True, blank=True)

    transport_cost = models.FloatField(default=0, blank=True)


# ---------------- SALES ----------------
class Sales(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    manager_name = models.CharField(max_length=100)
    order_date = models.DateField()
    dispatch_date = models.DateField()

    quantity = models.IntegerField()
    rate = models.FloatField()

    size = models.CharField(max_length=50)
    quality = models.CharField(max_length=50)


# ---------------- PRODUCTION ----------------
class Production(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    quantity = models.IntegerField()
    size = models.CharField(max_length=50)
    quality = models.CharField(max_length=50)

    requested_date = models.DateField()
    proposed_date = models.DateField(null=True, blank=True)
    actual_date = models.DateField(null=True, blank=True)