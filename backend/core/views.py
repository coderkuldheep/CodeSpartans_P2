from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import viewsets
from django.utils.timezone import now
from django.db.models import Sum
from django.core.mail import send_mail

from .models import User, Supplier, Product, Purchase, Sales, Production
from .serializers import (
    SupplierSerializer,
    PurchaseSerializer,
    SalesSerializer,
    ProductionSerializer,
    ProductSerializer,
)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'role': user.role,
            'username': user.username
        })

    return Response({'error': 'Invalid credentials'}, status=400)


# ---------------- SUPPLIER APIs ----------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_suppliers(request):
    suppliers = Supplier.objects.all()
    serializer = SupplierSerializer(suppliers, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_supplier(request):
    serializer = SupplierSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


# ---------------- PURCHASE APIs ----------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_purchases(request):
    purchases = Purchase.objects.all().order_by('-id')
    serializer = PurchaseSerializer(purchases, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_purchase(request):
    if request.user.role not in ['admin', 'purchase']:
        return Response({'error': 'Access Denied'}, status=403)

    data = request.data.copy()

    total_rate = float(data.get('total_rate', 0) or 0)
    advance = float(data.get('advance_amount', 0) or 0)

    data['advance_paid'] = advance
    data['balance_amount'] = total_rate - advance

    serializer = PurchaseSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)


# ---------------- SALES APIs ----------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_sales(request):
    sales = Sales.objects.all().order_by('-id')
    serializer = SalesSerializer(sales, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_sales(request):
    serializer = SalesSerializer(data=request.data)

    if serializer.is_valid():
        sales = serializer.save()

        send_mail(
            'New Sale Created',
            'A new sale has been recorded.',
            'kuldheepj@gmail.com',
            ['codecodecode259@gmail.com'],
            fail_silently=True,
        )

        Production.objects.create(
            product=sales.product,
            quantity=sales.quantity,
            size=sales.product.size,
            quality=sales.product.quality,
            requested_date=sales.order_date,
            proposed_date=sales.dispatch_date,
            actual_date=None
        )

        return Response({
            "message": "Sales added & Production created",
            "data": serializer.data
        }, status=201)

    return Response(serializer.errors, status=400)


# ---------------- PRODUCTION APIs ----------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_production(request):
    production = Production.objects.all().order_by('-id')
    serializer = ProductionSerializer(production, many=True)
    return Response(serializer.data)


# ---------------- DASHBOARD API ----------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    today = now().date()

    total_purchase_today = Purchase.objects.filter(date_received=today).aggregate(
        total=Sum('total_rate')
    )['total'] or 0

    total_purchase_count = Purchase.objects.count()

    total_sales_today = Sales.objects.filter(order_date=today).aggregate(
        total=Sum('rate')
    )['total'] or 0

    total_sales_count = Sales.objects.count()

    total_production = Production.objects.count()
    completed_production = Production.objects.filter(actual_date__isnull=False).count()
    pending_production = Production.objects.filter(actual_date__isnull=True).count()

    total_products = Product.objects.count()

    return Response({
        "purchase_today": total_purchase_today,
        "purchase_count": total_purchase_count,
        "sales_today": total_sales_today,
        "sales_count": total_sales_count,
        "total_products": total_products,
        "production_total": total_production,
        "production_completed": completed_production,
        "production_pending": pending_production,
    })


# ---------------- CHART API ----------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def sales_chart(request):
    data = Sales.objects.values('order_date').annotate(
        total=Sum('rate')
    ).order_by('order_date')

    return Response(data)


class SupplierView(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [IsAuthenticated]


class PurchaseView(viewsets.ModelViewSet):
    queryset = Purchase.objects.all()
    serializer_class = PurchaseSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        if request.user.role not in ['admin', 'purchase']:
            return Response({'error': 'Access Denied'}, status=403)

        data = request.data.copy()
        total_rate = float(data.get('total_rate', 0) or 0)
        advance = float(data.get('advance_amount', 0) or 0)

        data['advance_paid'] = advance
        data['balance_amount'] = total_rate - advance

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)


class SalesView(viewsets.ModelViewSet):
    queryset = Sales.objects.all()
    serializer_class = SalesSerializer
    permission_classes = [IsAuthenticated]


class ProductionView(viewsets.ModelViewSet):
    queryset = Production.objects.all()
    serializer_class = ProductionSerializer
    permission_classes = [IsAuthenticated]


class ProductView(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]