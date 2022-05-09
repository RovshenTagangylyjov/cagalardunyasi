from django.urls import path

from .views import ManagementView


app_label = 'management'

urlpatterns = [
    path('management/<int:pk>/', ManagementView.as_view())
]