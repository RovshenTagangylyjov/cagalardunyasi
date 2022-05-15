import datetime
import logging

from celery import shared_task
from django.conf import settings
from django.core.management import call_command


@shared_task
def backup():
    if settings.DEBUG is True:
        return "Could not be backed up: Debug is True"
    try:
        call_command("dbbackup")
        return f"Backed up successfully: {datetime.datetime.now()}"
    except Exception as ex:  # pylint: disable=broad-except
        logging.warning(str(ex))
        return f"Could not be backed up: {datetime.datetime.now()}"


@shared_task
def mediabackup():
    if settings.DEBUG is True:
        return "Could not be backed up: Debug is True"
    try:
        call_command("mediabackup")
        return f"Backed up successfully: {datetime.datetime.now()}"
    except Exception as ex:  # pylint: disable=broad-except
        logging.warning(str(ex))
        return f"Could not be backed up: {datetime.datetime.now()}"
