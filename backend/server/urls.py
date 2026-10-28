from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import FileResponse
from django.urls import re_path
from pathlib import Path


def frontend_app(request):
    return FileResponse((Path(settings.BASE_DIR).parent / 'frontend' / 'dist' / 'index.html').open('rb'))

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [re_path(r'^(?!api/|admin/|static/|media/).*$', frontend_app)]
