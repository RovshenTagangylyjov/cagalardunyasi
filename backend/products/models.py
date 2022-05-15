from datetime import datetime

from django.contrib.auth import get_user_model
from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    name_tk = models.CharField(max_length=40)
    name_rus = models.CharField(max_length=40)
    slug = models.SlugField()
    date_updated = models.DateTimeField(auto_now=True)
    date_created = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.slug

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name_tk, allow_unicode=True)

        super(Category, self).save(*args, **kwargs)


class Product(models.Model):
    name_tk = models.CharField(max_length=100)
    name_rus = models.CharField(max_length=100)
    description_tk = models.CharField(max_length=2500, blank=True)
    description_rus = models.CharField(max_length=2500, blank=True)
    categories = models.ManyToManyField(Category, related_name='products')
    slug = models.SlugField(blank=True)
    from_age = models.PositiveSmallIntegerField()
    to_age = models.PositiveSmallIntegerField()
    female = models.BooleanField()
    male = models.BooleanField()
    price = models.DecimalField(max_digits=7, decimal_places=2)
    stock = models.PositiveSmallIntegerField()
    liked_by = models.ManyToManyField(get_user_model(), related_name='favorites')
    total_sold = models.IntegerField(default=0)
    total_rated_users = models.IntegerField(default=0)
    total_rate = models.IntegerField(default=0)

    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date_created']

    @property
    def get_average_rating(self) -> float:
        if self.total_rated_users == 0:
            return 5
        else:
            return self.total_rate / self.total_rated_users

    def __str__(self):
        return self.name_tk

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name_tk, allow_unicode=True)

        super(Product, self).save(*args, **kwargs)


class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', null=True, blank=True, on_delete=models.CASCADE)
    path = models.CharField(max_length=255)
    order = models.PositiveSmallIntegerField()

    class Meta:
        ordering = ['order']


class Rating(models.Model):
    user = models.ForeignKey(get_user_model(), related_name='rates', null=True, on_delete=models.SET_NULL)
    product = models.ForeignKey(Product, related_name='ratings', on_delete=models.CASCADE)
    session = models.CharField(max_length=40, blank=True)
    rate = models.DecimalField(max_digits=2, decimal_places=1)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
