from rest_framework.routers import SimpleRouter

from .viewsets import UserViewSet, AddressViewSet


app_name = 'accounts'

router = SimpleRouter()
router.register('accounts', UserViewSet)
router.register('addresses', AddressViewSet)

urlpatterns = router.urls
