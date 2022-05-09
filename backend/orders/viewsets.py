from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from rest_framework.response import Response
from rest_framework.status import HTTP_405_METHOD_NOT_ALLOWED
from rest_framework.viewsets import ModelViewSet

from custom.filters import RelatedOrderingFilter
from custom.permissions import UpdateAdminOnly
from mixins.generics import UsersStaffMixin
from .models import Order
from .serializers import OrderSerializer


class OrderViewSet(UsersStaffMixin, ModelViewSet):
    permission_classes = [UpdateAdminOnly]
    serializer_class = OrderSerializer
    queryset = Order.objects.all().prefetch_related('address', 'cart', 'cart__items', 'cart__items__product',
                                                    'cart__items__product__images',
                                                    'cart__items__product__categories')
    filter_backends = [DjangoFilterBackend, SearchFilter, RelatedOrderingFilter]
    search_fields = ['id', 'address__first_name', 'address__last_name', 'address__phone_number', 'address__address']

    def get_queryset(self):
        if self.request.user.is_staff:
            return self.queryset

        return super().get_queryset()

    def destroy(self, request, *args, **kwargs):
        return Response(status=HTTP_405_METHOD_NOT_ALLOWED)
