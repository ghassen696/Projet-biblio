"""
URL configuration for Biblio_BackEnd project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from api.views import LibraryResourcesAPI,UsersAPI,AddResourcesBulk,AddReservationAPI,add_resource,LibraryResourceDetailAPI,UpdateResourceAPI, GetReservationsAPI,ReservationsAPI

urlpatterns = [
    path('admin/', admin.site.urls),
     path('api/library_resources/', LibraryResourcesAPI.as_view(), name='library-resources-list'),
    path('api/resources_detail/<str:pk>/', LibraryResourceDetailAPI.as_view(), name='library-resource-detail'),
    path('api/resources/<int:pk>/', UpdateResourceAPI.as_view(), name='update-resource'),
    path('api/resources/<int:ITEMID>/reservations/', ReservationsAPI.as_view(), name='reservations-list'),
    path('api/add-resource/', add_resource.as_view(), name='add_resource'),
    path('api/reservations/<int:ITEMID>/', AddReservationAPI.as_view(), name='add_reservation'),
    path('api/add-resources-bulk/', AddResourcesBulk.as_view(), name='add_resources_bulk'),
    path('api/users/', UsersAPI.as_view(), name='users-list'),



]
