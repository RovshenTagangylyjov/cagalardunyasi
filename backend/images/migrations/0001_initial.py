# Generated by Django 4.0.4 on 2022-05-09 17:43

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Image',
            fields=[
                ('hash', models.CharField(max_length=64, primary_key=True, serialize=False)),
                ('path', models.ImageField(upload_to='images')),
            ],
        ),
    ]