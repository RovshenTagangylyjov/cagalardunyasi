from rest_framework import serializers

from .models import Image
from helpers.image_compression import get_compressed_image_content, get_image_hash


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['path']

    def create(self, validated_data):
        raw_image = validated_data.pop('path')
        image_hash = get_image_hash(raw_image)
        image, is_created = Image.objects.get_or_create(hash=image_hash)

        if is_created:
            image.path = get_compressed_image_content(raw_image)
            image.save()

        return image
