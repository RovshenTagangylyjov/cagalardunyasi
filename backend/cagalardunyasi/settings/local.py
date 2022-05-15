from .base import *


DEBUG = True

SECRET_KEY = 'django-insecure-su^^g5yhvayaaoqd@d5(o_7#w-2(4@134$z=&6e*uug&f-382v'

ALLOWED_HOSTS = ['localhost', '127.0.0.1']

del STATIC_ROOT

DEFAULT_FILE_STORAGE = "django.core.files.storage.FileSystemStorage"
STATICFILES_STORAGE = "django.contrib.staticfiles.storage.StaticFilesStorage"

STATIC_URL = "/assets/"
MEDIA_URL = "/media/"


CORS_ALLOW_ALL_ORIGINS = True

INTERNAL_IPS = ['127.0.0.1']
