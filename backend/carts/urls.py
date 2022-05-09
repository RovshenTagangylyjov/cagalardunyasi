from rest_framework.routers import SimpleRouter

from .viewsets import CartViewSet, CartItemViewSet

app_name = 'carts'

router = SimpleRouter()
router.register('carts', CartViewSet)
router.register('cart-items', CartItemViewSet)

urlpatterns = router.urls
