from rest_framework.routers import SimpleRouter

from .viewsets import OrderViewSet

app_name = 'orders'

router = SimpleRouter()
router.register('orders', OrderViewSet)

urlpatterns = router.urls
