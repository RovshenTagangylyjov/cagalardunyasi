from django.contrib import admin
from django.contrib.sessions.models import Session

from .models import Cart, CartItem

admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Session)