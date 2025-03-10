from django.db import models
from django.contrib.auth.models import User
import requests

class Endereco(models.Model):
    cep = models.CharField(max_length=9)
    logradouro = models.CharField(max_length=100)
    bairro = models.CharField(max_length=50)
    cidade = models.CharField(max_length=50)
    estado = models.CharField(max_length=2)

    def buscar_cep(self):
        if self.cep:
            response = requests.get(f'https://viacep.com.br/ws/{self.cep}/json/')
            if response.status_code == 200:
                dados = response.json()
                self.logradouro = dados.get('logradouro', '')
                self.bairro = dados.get('bairro', '')
                self.cidade = dados.get('localidade', '')
                self.estado = dados.get('uf', '')
    
    def __str__(self):
        return f"{self.logradouro}, {self.bairro}, {self.cidade} - {self.estado}"

class Cliente(models.Model):
    nome = models.CharField(max_length=100)
    email = models.EmailField()
    telefone = models.CharField(max_length=15)
    endereco = models.OneToOneField(Endereco, on_delete=models.CASCADE)

    def __str__(self):
        return self.nome

class Produto(models.Model):
    nome = models.CharField(max_length=100)
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    quantidade = models.PositiveIntegerField()

    def atualizar_estoque(self, quantidade_vendida):
        self.quantidade -= quantidade_vendida
        self.save()

    def __str__(self):
        return f"{self.nome} - {self.quantidade} unidades"

class HistoricoVenda(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    quantidade = models.PositiveIntegerField()
    data = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.cliente.nome} comprou {self.produto.nome}"
