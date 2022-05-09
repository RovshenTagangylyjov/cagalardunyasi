from rest_framework.mixins import CreateModelMixin, RetrieveModelMixin
from rest_framework.viewsets import GenericViewSet

from .serializers import ImageSerializer
from .models import Image
from custom.permissions import AdminOnly


class ImageViewSet(CreateModelMixin, RetrieveModelMixin, GenericViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    permission_classes = [AdminOnly]
