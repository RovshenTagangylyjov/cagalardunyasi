from rest_framework import serializers

from .models import Cart, CartItem, Product
from products.serializers import ProductSerializer


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(source='product', write_only=True, queryset=Product.objects.all())

    class Meta:
        model = CartItem
        fields = ['id', 'cart', 'product', 'product_id', 'quantity']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    item_ids = serializers.PrimaryKeyRelatedField(many=True,
                                                  source='items',
                                                  write_only=True,
                                                  queryset=CartItem.objects.all())

    class Meta:
        model = Cart
        fields = ['id', 'items', 'item_ids', 'user', 'session']
        read_only_fields = ['id']
        extra_kwargs = {
            'user': {'write_only': True},
            'session': {'write_only': True}
        }
