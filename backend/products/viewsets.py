from django.db.models import F, Q, Prefetch, OuterRef, Exists
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.mixins import UpdateModelMixin, CreateModelMixin
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, GenericViewSet

from custom.permissions import IsAdminOrReadOnly
from mixins.generics import UsersStaffMixin
from .filters import ProductFilter
from .models import Product, Category, Rating
from .permissions import IsAdminOrIsAuthenticatedAndLikeOrReadOnly
from .serializers import ProductSerializer, CategorySerializer, RatingSerializer


class ProductViewSet(ModelViewSet):
    queryset = Product.objects.filter(is_deleted=False)
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['id', 'name_tk', 'name_rus', 'categories__name_tk', 'categories__name_rus']
    filterset_class = ProductFilter
    permission_classes = [IsAdminOrIsAuthenticatedAndLikeOrReadOnly]

    @action(detail=True, methods=['POST'])
    def like(self, request, *args, **kwargs):
        instance = self.get_object()
        is_favorite = True

        if instance.liked_by.filter(id=request.user.id).exists():
            instance.liked_by.remove(request.user)
            is_favorite = False
        else:
            instance.liked_by.add(request.user)

        return Response({'is_favorite': is_favorite})

    def get_queryset(self):
        user = self.request.user
        queryset = self.queryset

        if user.is_authenticated:
            favorites = user.favorites.filter(id=OuterRef('id'))
            queryset = queryset.annotate(is_favorite=Exists(favorites))

        if not user.is_staff:
            queryset = queryset.filter(stock__gt=0, is_active=True)

        ratings = Rating.objects.filter(Q(user=user.id) | Q(session=self.request.session.session_key))
        return queryset.prefetch_related(Prefetch('ratings', queryset=ratings, to_attr='users_rating'),
                                         'images', 'categories')

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()


class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = None
    permission_classes = [IsAdminOrReadOnly]


class RatingViewSet(UsersStaffMixin, CreateModelMixin, UpdateModelMixin, GenericViewSet):
    serializer_class = RatingSerializer
    queryset = Rating.objects.all()

    def perform_create(self, serializer):
        super().perform_create(serializer)
        Product.objects.filter(id=serializer.data['product']).update(total_rated_users=F('total_rated_users') + 1,
                                                                     total_rate=F('total_rate') + serializer.data[
                                                                         'rate'])

    def create(self, request, *args, **kwargs):
        rating = self.get_queryset().filter(product__id=request.data['product'])
        if rating.exists():
            serializer = self.get_serializer(rating.first(), data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)

            return Response(serializer.data)

        return super().create(request, *args, **kwargs)
