from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import login_view, SupplierView, PurchaseView, SalesView, ProductionView, ProductView, dashboard, sales_chart


router = DefaultRouter()
router.register(r'suppliers', SupplierView)
router.register(r'purchases', PurchaseView)
router.register(r'sales', SalesView)

router.register(r'production', ProductionView)
router.register(r'products', ProductView)


urlpatterns = [
    path('login/', login_view),   # ✅ login
      

    path('dashboard/', dashboard),
    path('sales-chart/', sales_chart),

    path('', include(router.urls)), # ✅ all APIs handled by router

]