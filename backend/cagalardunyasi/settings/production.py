from .base import *


INSTALLED_APPS += ["dbbackup"]

ADMINS = [("Çagalar Dünýäsi", "admin@cagalardunyasi.com")]
SERVER_EMAIL = "admin@cagalardunyasi.com"

# SECURE_HSTS_SECONDS = (
#     15768000  # set low, but when site is ready for deployment, set to at least 15768000 (6 months)
# )
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True


# db backup
DBBACKUP_STORAGE = "storages.backends.s3boto3.S3Boto3Storage"
DBBACKUP_STORAGE_OPTIONS = {
    "access_key": os.getenv("AWS_ACCESS_KEY_ID"),
    "secret_key": os.getenv("AWS_SECRET_ACCESS_KEY"),
    "bucket_name": os.getenv("AWS_BACKUP_BUCKET_NAME"),
    "default_acl": "private",
}
