from django.contrib import admin
from .models import User, Supplier, Product, Purchase, Sales, Production

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'is_staff', 'date_joined')
    search_fields = ('username', 'email')
    list_filter = ('role', 'is_staff', 'is_superuser')

@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'contact')
    search_fields = ('name', 'contact')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'size', 'quality')
    search_fields = ('name',)
    list_filter = ('size', 'quality')

@admin.register(Purchase)
class PurchaseAdmin(admin.ModelAdmin):
    list_display = ('id', 'supplier', 'product', 'total_quantity', 'total_rate', 'date_received', 'balance_amount')
    list_filter = ('supplier', 'product', 'date_received')
    search_fields = ('supplier__name', 'product__name')

@admin.register(Sales)
class SalesAdmin(admin.ModelAdmin):
    list_display = ('id', 'manager_name', 'product', 'quantity', 'rate', 'order_date')
    list_filter = ('product', 'order_date')
    search_fields = ('manager_name', 'product__name')

@admin.register(Production)
class ProductionAdmin(admin.ModelAdmin):
    list_display = ('id', 'product', 'quantity', 'requested_date', 'proposed_date', 'actual_date')
    list_filter = ('product', 'requested_date', 'actual_date')
    search_fields = ('product__name',)
