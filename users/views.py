from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from .models import Produto, Cliente, HistoricoVenda, Endereco
from .forms import ClienteForm, ProdutoForm, EnderecoForm
from django.contrib.auth.decorators import login_required
from django.http import HttpRequest

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return redirect('dashboard') 
        else:
            messages.error(request, 'Usuário ou senha inválidos.')
    return render(request, 'login.html')


def cadastrar_cliente(request):
    if request.method == 'POST':
        cliente_form = ClienteForm(request.POST)
        endereco_form = EnderecoForm(request.POST)
        if cliente_form.is_valid() and endereco_form.is_valid():
            endereco = endereco_form.save(commit=False)
            endereco.buscar_cep()
            endereco.save()
            cliente = cliente_form.save(commit=False)
            cliente.endereco = endereco
            cliente.save()
            messages.success(request, 'Cliente cadastrado com sucesso!')
            return redirect('dashboard')
    else:
        cliente_form = ClienteForm()
        endereco_form = EnderecoForm()
    return render(request, 'cadastro_cliente.html', {'cliente_form': cliente_form, 'endereco_form': endereco_form})

def cadastrar_produto(request):
    if request.method == 'POST':
        form = ProdutoForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Produto cadastrado com sucesso!')
            return redirect('dashboard')
    else:
        form = ProdutoForm()
    return render(request, 'cadastro_produto.html', {'form': form})

@login_required
def dashboard(request):
    produtos = Produto.objects.all()
    clientes = Cliente.objects.all()
    return render(request, 'dashboard.html', {'produtos': produtos, 'clientes': clientes})
