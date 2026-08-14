from django.urls import path, re_path, include
from django.views.static import serve
from pathlib import Path
from api.views import ApiRootView
from api.admin import admin_site

BASE_DIR = Path(__file__).resolve().parent.parent
PUBLIC_ASSETS = BASE_DIR.parent / 'public' / 'assets'
if not PUBLIC_ASSETS.exists():
    PUBLIC_ASSETS = BASE_DIR / 'public' / 'assets'

urlpatterns = [
    path('', ApiRootView.as_view(), name='root'),
    path('admin/', admin_site.urls),
    path('api/', include('api.urls')),
    re_path(r'^assets/(?P<path>.*)$', serve, {'document_root': PUBLIC_ASSETS}),
]
