from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):

    username = models.PositiveIntegerField(
        verbose_name='Phone Number',
        unique=True,
        validators=[MinValueValidator(61000000), MaxValueValidator(65999999)],
        error_messages={
            'unique': _("A user with that number already exists."),
        },
    )

    def __str__(self):
        return f'{self.username}'


class Address(models.Model):
    user = models.ForeignKey(get_user_model(), related_name='addresses',
                             on_delete=models.SET_NULL, null=True, blank=True)
    session = models.CharField(max_length=40, blank=True)
    first_name = models.CharField(_('first name'), max_length=30)
    last_name = models.CharField(_('last name'), max_length=30)
    address = models.CharField(max_length=100)
    phone_number = models.PositiveIntegerField(
        verbose_name='Phone Number',
        validators=[MinValueValidator(61000000), MaxValueValidator(65999999)],
        error_messages={
            'unique': _("A user with that number already exists."),
        },
    )
    is_deleted = models.BooleanField(default=False)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
