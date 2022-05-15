from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from .models import Product, ProductImage, Category, Rating


class ProductImageSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = ProductImage
        fields = ['id', 'path', 'order']


class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ['slug']


class RatingSerializer(ModelSerializer):
    class Meta:
        model = Rating
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True)
    categories = serializers.PrimaryKeyRelatedField(many=True, queryset=Category.objects.all())
    average_rating = serializers.DecimalField(source='get_average_rating', max_digits=2, decimal_places=1,
                                              read_only=True)
    is_favorite = serializers.SerializerMethodField()
    users_rating = serializers.SerializerMethodField()

    class Meta:
        model = Product
        read_only_fields = ['slug']
        exclude = ['liked_by', 'is_deleted']

    def get_is_favorite(self, obj):
        try:
            return obj.is_favorite
        except AttributeError:
            pass

        return None

    def get_users_rating(self, obj):
        try:
            if len(obj.users_rating):
                return RatingSerializer(obj.users_rating[0]).data
        except AttributeError:
            pass

        return None

    def validate(self, data):
        super().validate(data)

        if not self.partial:
            if len(data['images']) == 0:
                raise serializers.ValidationError('Images are required.')

            if len(data['categories']) == 0:
                raise serializers.ValidationError('Categories are required.')

            if not (data['male'] or data['female']):
                raise serializers.ValidationError('Product must be for either male or female.')

            if not (data['from_age'] < data['to_age']):
                raise serializers.ValidationError('"From Age" must me smaller than "To Age".')

        return data

    def create(self, validated_data):
        images = validated_data.pop('images')
        categories = validated_data.pop('categories')

        product = Product.objects.create(**validated_data)

        for image in images:
            image_dict = dict(image)
            ProductImage.objects.create(product=product, **image_dict)

        product.categories.add(*categories)

        return product

    def update(self, instance, validated_data):
        try:
            images = validated_data.pop('images')
            paths = []

            for image in images:
                image_dict = dict(image)
                ProductImage.objects.update_or_create(product=instance, path=image_dict.get('path'),
                                                      defaults={'order': image_dict.get('order')})
                paths.append(image_dict['path'])

            ProductImage.objects.filter(product=instance).exclude(path__in=paths).delete()
        except KeyError:
            pass

        return super(ProductSerializer, self).update(instance, validated_data)
