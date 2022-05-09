from rest_framework import serializers

from carts.models import Cart
from accounts.models import Address
from accounts.serializers import AddressSerializer
from carts.serializers import CartSerializer
from .models import Order


class OrderSerializer(serializers.ModelSerializer):
    cart = CartSerializer(read_only=True)
    cart_id = serializers.PrimaryKeyRelatedField(source='cart', write_only=True,
                                                 queryset=Cart.objects.filter(order=None))
    address = AddressSerializer(read_only=True)
    address_id = serializers.PrimaryKeyRelatedField(source='address', write_only=True,
                                                    queryset=Address.objects.all())

    class Meta:
        model = Order
        exclude = ['user', 'session']
