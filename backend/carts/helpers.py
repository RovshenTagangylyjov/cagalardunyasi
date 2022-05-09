from accounts.models import User
from .models import Cart


def merge_carts(user_cart: Cart, session_cart: Cart):  # TODO: FInd another way
    for session_cart_item in session_cart.items.all():
        added = False

        for user_cart_item in user_cart.items.all():

            if user_cart_item.product == session_cart_item.product:
                user_cart_item.quantity = session_cart_item.quantity
                user_cart_item.save()
                added = True

        if not added:
            user_cart.items.add(session_cart_item)

    user_cart.save()
    return user_cart


def get_merged_cart(user_cart: Cart, session_cart: Cart, user: User):
    if user_cart and session_cart:
        if user_cart.items.all() and session_cart.items.all():
            return merge_carts(user_cart, session_cart)

        if not user_cart.items and session_cart.items:
            user_cart.items = session_cart.items
            user_cart.save()

            return user_cart

    if not user_cart and session_cart:
        session_cart.session = ''
        session_cart.user = user
        session_cart.save()

        return session_cart

    return user_cart


def optimize_cart(cart: Cart):
    for item in cart.items.all():
        if item.product.is_deleted or  item.product.stock <= 0:
            item.delete()

        if item.product.stock > item.quantity:
            item.quantity = item.product.stock
            item.save()