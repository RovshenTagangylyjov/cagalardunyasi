FROM python:3.10.4

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ bionic-pgdg main" >> /etc/apt/sources.list.d/pgdg.list
RUN apt update && apt upgrade -y && apt install postgresql-client-12 -y

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . backend/
WORKDIR backend

RUN chmod a+x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]

