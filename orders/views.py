"""Order views — list/create orders for the authenticated user."""

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import transaction
from .models import Order, OrderItem
from .serializers import OrderSerializer, CreateOrderSerializer
from products.models import Product


class OrderListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/orders/       — List current user's orders
    POST /api/orders/       — Create a new order
    """
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateOrderSerializer
        return OrderSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        # Build order items from DB-fetched prices
        order_items = []
        subtotal = 0

        for item_data in data['items']:
            product = Product.objects.get(id=item_data['product_id'])
            quantity = int(item_data['quantity'])
            price = product.effective_price
            line_total = price * quantity
            subtotal += line_total
            order_items.append((product, quantity, price))

        shipping_cost = 0 if subtotal >= 50 else 5.99
        total = subtotal + shipping_cost

        # Create the order
        order = Order.objects.create(
            user=request.user,
            subtotal=subtotal,
            shipping_cost=shipping_cost,
            total=total,
            full_name=data['full_name'],
            address_line_1=data['address_line_1'],
            address_line_2=data.get('address_line_2', ''),
            city=data['city'],
            state=data['state'],
            zip_code=data['zip_code'],
            country=data.get('country', 'United States'),
            phone=data['phone'],
            payment_method=data.get('payment_method', 'mock_card'),
            status=Order.Status.PAID,  # Mock payment — auto-mark as paid
        )

        # Create order items
        for product, quantity, price in order_items:
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price_at_purchase=price,
            )
            # Decrement stock
            product.stock = max(0, product.stock - quantity)
            product.save()

        response_serializer = OrderSerializer(order)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class OrderDetailView(generics.RetrieveAPIView):
    """
    GET /api/orders/<id>/ — Retrieve a specific order (must belong to the user)
    """
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)