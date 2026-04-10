from rest_framework.decorators import api_view , permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import *
from .serializers import SupplierSerializer, PurchaseSerializer, SalesSerializer, ProductionSerializer, ProductSerializer

@api_view(['POST'])
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
        return Response(serializer.data)
    return Response(serializer.errors)


# ---------------- PURCHASE APIs ----------------

# 🔐 Only 2 users allowed
ALLOWED_PURCHASE_USERS = ['user1', 'user2']  # CHANGE THIS

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_purchases(request):
    purchases = Purchase.objects.all().order_by('-id')
    serializer = PurchaseSerializer(purchases, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_purchase(request):

    # 🔐 ROLE RESTRICTION
    if request.user.username not in ALLOWED_PURCHASE_USERS:
        return Response({'error': 'Access Denied'}, status=403)

    data = request.data.copy()

    # 💡 AUTO CALCULATION
    total_rate = float(data.get('total_rate', 0))
    advance = float(data.get('advance_amount', 0))

    data['balance_amount'] = total_rate - advance

    serializer = PurchaseSerializer(data=data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)

from .models import Sales, Production, Product
from .serializers import SalesSerializer, ProductionSerializer


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

    from django.core.mail import send_mail

    send_mail(
    'New Sale Created',
    'A new sale has been recorded.',
    'kuldheepj@gmail.com',
    ['codecodecode259@gmail.com'],
    )

    if serializer.is_valid():
        sales = serializer.save()

        # 🔥 AUTO PRODUCTION SYNC
        Production.objects.create(
            product=sales.product,
            quantity=sales.quantity,
            size=sales.product.size,
            quality=sales.product.quality,
            requested_date=sales.date_of_order,
            proposed_date=sales.date_of_dispatch,
            actual_date=None
        )

        return Response({
            "message": "Sales added & Production created",
            "data": serializer.data
        })

    return Response(serializer.errors)


# ---------------- PRODUCTION APIs ----------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_production(request):
    production = Production.objects.all().order_by('-id')
    serializer = ProductionSerializer(production, many=True)
    return Response(serializer.data)


from django.utils.timezone import now
from django.db.models import Sum, Count


# ---------------- DASHBOARD API ----------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard(request):

    today = now().date()

    # 🔹 PURCHASE STATS
    total_purchase_today = Purchase.objects.filter(date_of_receipt=today).aggregate(
        total=Sum('total_rate')
    )['total'] or 0

    total_purchase_count = Purchase.objects.count()

    # 🔹 SALES STATS
    total_sales_today = Sales.objects.filter(date_of_order=today).aggregate(
        total=Sum('rate')
    )['total'] or 0

    total_sales_count = Sales.objects.count()

    # 🔹 PRODUCTION STATS
    total_production = Production.objects.count()

    completed_production = Production.objects.filter(actual_date__isnull=False).count()

    pending_production = Production.objects.filter(actual_date__isnull=True).count()

    # 🔹 INVENTORY (TOTAL PRODUCTS)
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

    data = Sales.objects.values('date_of_order').annotate(
        total=Sum('rate')
    ).order_by('date_of_order')

    return Response(data)


class SupplierView(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [IsAuthenticated]

class PurchaseView(viewsets.ModelViewSet):
    queryset = Purchase.objects.all()
    serializer_class = PurchaseSerializer
    permission_classes = [IsAuthenticated]

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

