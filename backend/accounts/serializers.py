from django.utils.translation import gettext as _

from rest_framework import serializers

from .models import User, Address
from carts.models import Cart


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'user', 'session', 'first_name', 'last_name', 'phone_number', 'address']
        read_only_fields = ['id']
        extra_kwargs = {
            'user': {'write_only': True},
            'session': {'write_only': True}
        }


from orders.serializers import OrderSerializer


class UserSerializer(serializers.ModelSerializer):
    addresses = serializers.SerializerMethodField()
    orders = OrderSerializer(many=True, read_only=True)
    cart_id = serializers.PrimaryKeyRelatedField(source='carts', write_only=True,
                                                 queryset=Cart.objects.filter(order=None))
    password = serializers.CharField(max_length=128, min_length=8, write_only=True)
    password2 = serializers.CharField(max_length=128, min_length=8, write_only=True)

    def get_addresses(self, obj):
        addresses = obj.addresses.filter(is_deleted=False)

        return AddressSerializer(addresses, many=True, read_only=True).data

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password', 'password2',
                  'addresses', 'cart_id', 'orders', 'is_staff']

        read_only_fields = ['email', 'is_staff']
        extra_kwargs = {
            'username': {
                'error_messages': {
                    'unique': _('User with the phone number already exists.')
                }
            }
        }

    def validate(self, data):
        if not self.partial:
            if data['password'] != data['password2']:
                raise serializers.ValidationError('Passwords are not the same!')

        return super().validate(data)

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password'],
            email=None
        )
