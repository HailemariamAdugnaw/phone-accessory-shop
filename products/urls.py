from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CategoryListView, FeaturedProductsView

router = DefaultRouter()
router.register('', ProductViewSet, basename='product')

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('featured/', FeaturedProductsView.as_view(), name='featured-products'),
    path('', include(router.urls)),
]