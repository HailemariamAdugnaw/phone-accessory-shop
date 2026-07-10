"""Product views — ViewSet with filtering, searching, and sorting."""

from rest_framework import viewsets, filters, generics
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer
from .filters import ProductFilter


class ProductViewSet(viewsets.ModelViewSet):
    """
    CRUD for products with:
    - Filter: ?category=, ?min_price=, ?max_price=, ?min_rating=, ?in_stock_only=
    - Search: ?search= (searches name and description)
    - Sort:   ?ordering=price, -price, rating, -rating, created_at, -created_at
    """
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'rating', 'created_at', 'num_reviews']
    ordering = ['-created_at']
    lookup_field = 'slug'


class CategoryListView(generics.ListAPIView):
    """List all categories with product counts."""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class FeaturedProductsView(generics.ListAPIView):
    """List featured products."""
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Product.objects.filter(is_featured=True, is_active=True)[:8]