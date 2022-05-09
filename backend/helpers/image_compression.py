"""Image compression helper functions."""

import hashlib
import uuid
from io import BytesIO

from django.core.files.base import ContentFile
from PIL import Image


def get_compressed_image_content(image_field_file: ContentFile) -> ContentFile:
    """Compress the image and return hash and the image."""
    img_io = BytesIO()
    img = Image.open(image_field_file)
    new_name = f"{str(uuid.uuid4())}.png"
    img.save(img_io, format="png", quality=80, optimize=True)
    img_io.seek(0)

    return ContentFile(img_io.getvalue(), new_name)


def get_image_hash(image_field_file: ContentFile) -> str:
    img = Image.open(image_field_file)
    image_hash = hashlib.sha256(img.tobytes())
    return image_hash.hexdigest()
