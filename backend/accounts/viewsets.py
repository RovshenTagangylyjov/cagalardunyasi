from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.status import HTTP_405_METHOD_NOT_ALLOWED
from rest_framework.viewsets import ModelViewSet

from cagalardunyasi.settings import COOKIE_AGE
from custom.permissions import UserPermission
from mixins.generics import UsersStaffMixin
from .models import User, Address
from .serializers import UserSerializer, AddressSerializer


class UserViewSet(ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    ALLOWED_METHODS = ['POST']
    permission_classes = [UserPermission]

    def get_queryset(self):
        if self.request.user.is_staff:
            return self.queryset

        return self.queryset.filter(id=self.request.user.id)

    @action(detail=False, methods=['GET'])
    def me(self, request):
        user = User.objects.filter(id=request.user.id).prefetch_related('addresses', 'orders__address', 'orders__cart',
                                                                        'orders__cart__items',
                                                                        'orders__cart__items__product',
                                                                        'orders__cart__items__product__images',
                                                                        'orders__cart__items__product__categories',
                                                                        )

        serializer = self.get_serializer(user.first())

        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        return Response(status=HTTP_405_METHOD_NOT_ALLOWED)


class AddressViewSet(UsersStaffMixin, ModelViewSet):
    serializer_class = AddressSerializer
    queryset = Address.objects.filter(is_deleted=False)

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()
