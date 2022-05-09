import django_filters
from amqp.spec import method

from .models import Product, Category


class ProductFilter(django_filters.FilterSet):
    categories = django_filters.ModelMultipleChoiceFilter(field_name='categories__slug', to_field_name='slug', queryset=Category.objects.all())
    from_age = django_filters.NumberFilter(field_name='from_age', lookup_expr='gte')
    to_age = django_filters.NumberFilter(field_name='from_age', lookup_expr='lte')
    from_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    to_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    favorites = django_filters.BooleanFilter(method='filter_favorites')

    def filter_favorites(self, queryset, name, value):
        if self.request.user.is_authenticated and value:
            return queryset.filter(liked_by__id=self.request.user.id)

        return queryset

    class Meta:
        model = Product
        fields = ['categories', 'from_age', 'to_age', 'from_price', 'to_price', 'female', 'male']
