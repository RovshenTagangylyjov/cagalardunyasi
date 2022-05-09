from django.db import models


class Image(models.Model):
    hash = models.CharField(primary_key=True, max_length=64)
    path = models.ImageField(upload_to='images')
