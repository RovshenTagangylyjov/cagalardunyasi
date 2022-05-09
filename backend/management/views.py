from rest_framework.generics import RetrieveUpdateAPIView

from .models import Management
from .serializers import ManagementSerializer
from custom.permissions import IsAdminOrReadOnly


class ManagementView(RetrieveUpdateAPIView):
    serializer_class = ManagementSerializer
    queryset = Management.objects.all()
    permission_classes = [IsAdminOrReadOnly]
