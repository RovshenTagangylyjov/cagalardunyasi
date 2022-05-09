from django.db import models


class Management(models.Model):
    dollar = models.DecimalField(max_digits=4, decimal_places=2)
    date_updated = models.DateTimeField(auto_now=True)
