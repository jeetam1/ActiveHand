from django.contrib import admin
from django.urls import path, include
from api.views import ApiRootView

urlpatterns = [
    path('', ApiRootView.as_view(), name='root'),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]
