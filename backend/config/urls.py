from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/sprzet/', include('sprzet.urls')),
      path('api/', include('uzytkownicy.urls')),
]

