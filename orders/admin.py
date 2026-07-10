from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    readonly_fields = ('product', 'quantity', 'price_at_purchase', 'line_total')
    extra = 0

    def line_total(self, obj):
        return obj.line_total
    line_total.short_description = 'Line Total'


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'user', 'status', 'total', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('order_number', 'user__email', 'full_name')
    readonly_fields = ('order_number', 'subtotal', 'shipping_cost', 'total', 'created_at', 'updated_at')
    inlines = [OrderItemInline]
    list_editable = ('status',)