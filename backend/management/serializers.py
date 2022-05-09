from rest_framework.serializers import ModelSerializer

from management.models import Management


class ManagementSerializer(ModelSerializer):
    class Meta:
        model = Management
        fields = '__all__'
