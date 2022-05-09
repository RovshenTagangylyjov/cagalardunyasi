from rest_framework.routers import SimpleRouter

from .viewsets import ImageViewSet

app_name = 'images'

router = SimpleRouter()
router.register('images', ImageViewSet)

urlpatterns = router.urls
