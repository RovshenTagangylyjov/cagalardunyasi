from django.db.models import Q
from rest_framework.decorators import action
from rest_framework.mixins import CreateModelMixin, RetrieveModelMixin, DestroyModelMixin, UpdateModelMixin
from rest_framework.response import Response
from rest_framework.status import HTTP_404_NOT_FOUND
from rest_framework.viewsets import GenericViewSet

from cagalardunyasi.settings import COOKIE_AGE
from mixins.generics import UsersStaffMixin
from .helpers import get_merged_cart, optimize_cart
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer


class CartViewSet(UsersStaffMixin, CreateModelMixin, RetrieveModelMixin, GenericViewSet):
    queryset = Cart.objects.filter(order=None).prefetch_related('items__product', 'items__product__categories',
                                                                'items__product__images')
    serializer_class = CartSerializer

    def get_object(self):
        cart = super().get_object()
        optimize_cart(cart)

        return cart

    @action(detail=False, methods=['GET'])
    def my(self, request):

        if not (request.user.is_authenticated or request.user.carts.filter(order=None).exists()):
            return Response(status=HTTP_404_NOT_FOUND)

        cart = request.user.carts.filter(order=None).last()
        try:
            session_cart_id = request.COOKIES['cartid']
            session_cart = self.get_queryset().get(id=session_cart_id)

            cart = get_merged_cart(cart, session_cart, request.user)

        except (KeyError, Cart.DoesNotExist):
            pass

        optimize_cart(cart)

        serializer = self.serializer_class(cart)
        return Response(serializer.data)


class CartItemViewSet(CreateModelMixin, UpdateModelMixin, DestroyModelMixin, GenericViewSet):
    queryset = CartItem.objects.filter(cart__order=None)
    serializer_class = CartItemSerializer

    def create(self, request, *args, **kwargs):
        try:
            if not self.queryset.filter(Q(id=request.data['cart_id']) and
                                        (Q(session=request.session.session_key) or Q(user=request.user))).exists():
                return Response(status=HTTP_404_NOT_FOUND)

        except KeyError:
            pass

        return super().create(request, *args, **kwargs)

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return self.queryset.filter(cart__user=self.request.user)

        return self.queryset.filter(cart__session=self.request.session.session_key)
