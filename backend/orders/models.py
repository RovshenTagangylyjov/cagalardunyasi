from django.contrib.auth import get_user_model
from django.db import models
from django.db.models import F

from accounts.models import Address
from carts.models import Cart, CartItem
from products.models import Product


class Order(models.Model):
    PENDING = 'PND'
    AWAITING_SHIPMENT = 'ASH'
    SHIPPING = 'SHP'
    COMPLETED = 'CMP'
    CANCELLED = 'CNC'
    ORDER_STATUSES = [
        (PENDING, 'Pending'),
        (AWAITING_SHIPMENT, 'Awaiting Shipment'),
        (SHIPPING, 'Shipping'),
        (COMPLETED, 'Completed'),
        (CANCELLED, 'Canceled')
    ]
    user = models.ForeignKey(get_user_model(), related_name='orders', null=True, blank=True, on_delete=models.SET_NULL)
    session = models.CharField(max_length=40, blank=True)
    cart = models.OneToOneField(Cart, related_name='order', on_delete=models.CASCADE)
    address = models.ForeignKey(Address, related_name='orders', on_delete=models.CASCADE)
    note = models.CharField(max_length=500, blank=True)
    order = models.PositiveSmallIntegerField(blank=True)
    total_price = models.DecimalField(max_digits=8, decimal_places=2, blank=True)
    status = models.CharField(max_length=3, choices=ORDER_STATUSES, default=PENDING)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    def save(self, **kwargs):
        if self.status == self.COMPLETED:
            for cart_item in self.cart.items.all():
                Product.objects.filter(cart_items__pk=cart_item.pk).update(
                    total_solt=F('total_solt') + cart_item.quantity, stock=F('stock') - cart_item.quantity)

        self.total_price = self.cart.get_total_price()

        for index, status in enumerate(self.ORDER_STATUSES):
            if status[0] == self.status:
                self.order = index

        super().save(kwargs)

    class Meta:
        ordering = ['order', '-date_created']
