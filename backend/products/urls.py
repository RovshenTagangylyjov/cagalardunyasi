from rest_framework.routers import SimpleRouter

from .viewsets import ProductViewSet, CategoryViewSet, RatingViewSet

app_name = 'products'

router = SimpleRouter()
router.register('products', ProductViewSet)
router.register('categories', CategoryViewSet)
router.register('ratings', RatingViewSet)

urlpatterns = router.urls
