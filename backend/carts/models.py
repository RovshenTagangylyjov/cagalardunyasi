from django.db import models
from django.db.models import Sum, F

from accounts.models import User
from products.models import Product


class Cart(models.Model):
    user = models.ForeignKey(User, related_name='carts', null=True, blank=True, on_delete=models.CASCADE)
    session = models.CharField(max_length=40, blank=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    def get_total_price(self):
        return self.items.aggregate(total_price=Sum(F('product__price') * F('quantity')))['total_price']


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='cart_items', on_delete=models.CASCADE)
    quantity = models.PositiveSmallIntegerField()
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
