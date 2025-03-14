from django.urls import path
from users import views

urlpatterns = [
    path('', views.cadastrar_cliente, name='cadastrar_cliente'),
    path('login/', views.login_view, name='login'),
    path('dashboard/', views.dashboard, name='dashboard'),  
    path('cadastrar_produto/', views.cadastrar_produto, name='cadastrar_produto'),
]
