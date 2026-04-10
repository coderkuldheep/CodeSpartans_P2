
from rest_framework import serializers
from .models import *

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'

class PurchaseSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    
    class Meta:
        model = Purchase
        fields = '__all__'

class SalesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sales 
        fields = '__all__'


class ProductionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Production
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


