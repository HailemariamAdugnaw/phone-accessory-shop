from rest_framework import serializers
from .models import Order, OrderItem
from products.serializers import ProductSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    line_total = serializers.ReadOnlyField()

    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'quantity', 'price_at_purchase', 'line_total')


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = (
            'id', 'order_number', 'status', 'subtotal', 'shipping_cost', 'total',
            'full_name', 'address_line_1', 'address_line_2', 'city', 'state',
            'zip_code', 'country', 'phone', 'payment_method', 'items',
            'created_at', 'updated_at'
        )
        read_only_fields = (
            'id', 'order_number', 'status', 'subtotal', 'shipping_cost', 'total',
            'created_at', 'updated_at'
        )


class CreateOrderSerializer(serializers.Serializer):
    """
    Input serializer for creating an order.
    The backend fetches product prices from the database — client-sent prices are not trusted.
    """
    items = serializers.ListField(
        child=serializers.DictField(),
        min_length=1,
        help_text='List of {"product_id": int, "quantity": int}'
    )
    full_name = serializers.CharField(max_length=200)
    address_line_1 = serializers.CharField(max_length=255)
    address_line_2 = serializers.CharField(max_length=255, required=False, allow_blank=True)
    city = serializers.CharField(max_length=100)
    state = serializers.CharField(max_length=100)
    zip_code = serializers.CharField(max_length=20)
    country = serializers.CharField(max_length=100, default='United States')
    phone = serializers.CharField(max_length=20)
    payment_method = serializers.CharField(max_length=50, default='mock_card')

    def validate_items(self, value):
        from products.models import Product
        for item in value:
            if 'product_id' not in item or 'quantity' not in item:
                raise serializers.ValidationError('Each item must have product_id and quantity.')
            try:
                Product.objects.get(id=item['product_id'], is_active=True)
            except Product.DoesNotExist:
                raise serializers.ValidationError(f'Product with id {item["product_id"]} does not exist.')
            if int(item['quantity']) < 1:
                raise serializers.ValidationError('Quantity must be at least 1.')
        return value