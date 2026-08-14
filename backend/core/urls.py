from django.urls import path, include
from api.views import ApiRootView
from api.admin import admin_site

urlpatterns = [
    path('', ApiRootView.as_view(), name='root'),
    path('admin/', admin_site.urls),
    path('api/', include('api.urls')),
]
