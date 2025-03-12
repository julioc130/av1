
const products = [];
document.getElementById('product-form')?.addEventListener('submit', function (event) {
    event.preventDefault();
    const name = document.getElementById('product-name').value;
    const price = document.getElementById('product-price').value;
    const quantity = document.getElementById('product-quantity').value;
    products.push({ name, price, quantity });
    alert('Produto cadastrado com sucesso!');
});


const clients = [];
document.getElementById('client-form')?.addEventListener('submit', function (event) {
    event.preventDefault();
    const name = document.getElementById('client-name').value;
    const phone = document.getElementById('client-phone').value;
    const address = {
        street: document.getElementById('client-street').value,
        neighborhood: document.getElementById('client-neighborhood').value,
        city: document.getElementById('client-city').value,
        state: document.getElementById('client-state').value
    };
    clients.push({ name, phone, address });
    alert('Cliente cadastrado com sucesso!');
});
function pesquisacep(valor) {
    var cep = valor.replace(/\D/g, '');
if (cep != "") {
   var validacep = /^[0-9]{8}$/;
if(validacep.test(cep)) {
   document.getElementById('estado').value="...";
   document.getElementById('cidade').value="...";
   document.getElementById('bairro').value="...";
   document.getElementById('rua').value="...";
   var script = document.createElement('script');
   script.src = 'https://viacep.com.br/ws/'+ cep + '/json/?callback=meu_callback';
   document.body.appendChild(script);
} else {
   limpa_formulario_cep();
   alert("Formato de CEP inválido.");
}
} else {
    limpa_formulario_cep();
}
}
function limpa_formulario_cep() {
   document.getElementById('estado').value=("");
   document.getElementById('cidade').value=("");
   document.getElementById('bairro').value=("");
   document.getElementById('rua').value=("");
}
function meu_callback(conteudo) {
   if (!("erro" in conteudo)) {
       document.getElementById('estado').value=(conteudo.uf);
       document.getElementById('cidade').value=(conteudo.localidade);
       document.getElementById('bairro').value=(conteudo.bairro);
       document.getElementById('rua').value=(conteudo.logradouro);
   } else {
   limpa_formulario_cep();
   alert("CEP não encontrado.");
}
}

function showHistory() {
    const historyList = document.getElementById('history-list');
    if (!historyList) return;
    historyList.innerHTML = '';

    products.forEach(product => {
        const li = document.createElement('li');
        li.textContent = `Produto: ${product.name}, Preço: R$${product.price}, Quantidade: ${product.quantity}`;
        historyList.appendChild(li);
    });

    clients.forEach(client => {
        const li = document.createElement('li');
        li.textContent = `Cliente: ${client.name}, Telefone: ${client.phone}, Endereço: ${client.address.street}, ${client.address.neighborhood}, ${client.address.city} - ${client.address.state}`;
        historyList.appendChild(li);
    });
}

const estoque = [];
const pedidosCompra = [];
const vendasRealizadas = [];

function atualizarExibicao() {
    document.getElementById('estoque-output').innerHTML = `
        <h3>Estoque Atual</h3>
        ${estoque.map(produto => `<div>${produto.nome}: ${produto.quantidade} unidades</div>`).join('') || '<p>Estoque vazio</p>'}
    `;
    document.getElementById('pedidos-output').innerHTML = `
        <h3>Pedidos de Compra</h3>
        ${pedidosCompra.map(pedido => `<div>${pedido.nome}: ${pedido.quantidade} unidades</div>`).join('') || '<p>Sem pedidos registrados</p>'}
    `;
    document.getElementById('vendas-output').innerHTML = `
        <h3>Vendas Realizadas</h3>
        ${vendasRealizadas.map(venda => `<div>${venda.nome}: ${venda.quantidade} unidades</div>`).join('') || '<p>Nenhuma venda realizada</p>'}
    `;
}

function adicionarProduto() {
    const nome = document.getElementById('produto-nome').value.trim();
    const quantidade = parseInt(document.getElementById('produto-quantidade').value);
    if (nome && quantidade > 0) {
        const produto = estoque.find(p => p.nome.toLowerCase() === nome.toLowerCase());
        if (produto) {
            produto.quantidade += quantidade;
        } else {
            estoque.push({ nome, quantidade });
        }
        atualizarExibicao();
        alert("Produto adicionado ao estoque.");
    } else {
        alert("Insira um nome e uma quantidade válida.");
    }
}

function removerProduto() {
    const nome = document.getElementById('produto-nome').value.trim();
    if (nome) {
        const index = estoque.findIndex(p => p.nome.toLowerCase() === nome.toLowerCase());
        if (index > -1) {
            estoque.splice(index, 1);
            atualizarExibicao();
            alert("Produto removido do estoque.");
        } else {
            alert("Produto não encontrado.");
        }
    } else {
        alert("Insira o nome do produto a ser removido.");
    }
}

function adicionarPedidoCompra() {
    const nome = document.getElementById('produto-nome').value.trim();
    const quantidade = parseInt(document.getElementById('produto-quantidade').value);
    if (nome && quantidade > 0) {
        pedidosCompra.push({ nome, quantidade });
        atualizarExibicao();
        alert("Pedido de compra registrado.");
    } else {
        alert("Insira um nome e uma quantidade válida.");
    }
}

function processarPedidoCompra() {
    if (pedidosCompra.length > 0) {
        const pedido = pedidosCompra.shift();
        const produto = estoque.find(p => p.nome.toLowerCase() === pedido.nome.toLowerCase());
        if (produto) {
            produto.quantidade += pedido.quantidade;
        } else {
            estoque.push(pedido);
        }
        atualizarExibicao();
        alert("Pedido de compra processado.");
    } else {
        alert("Nenhum pedido de compra para processar.");
    }
}

function registrarVenda() {
    const nome = document.getElementById('produto-nome').value.trim();
    const quantidade = parseInt(document.getElementById('produto-quantidade').value);
    const produto = estoque.find(p => p.nome.toLowerCase() === nome.toLowerCase());
    if (produto && quantidade > 0 && produto.quantidade >= quantidade) {
        produto.quantidade -= quantidade;
        vendasRealizadas.push({ nome, quantidade });
        atualizarExibicao();
        alert("Venda registrada.");
    } else {
        alert("Venda não realizada. Produto indisponível ou quantidade inválida.");
    }
}

function desfazerVenda() {
    if (vendasRealizadas.length > 0) {
        const ultimaVenda = vendasRealizadas.pop();
        const produto = estoque.find(p => p.nome.toLowerCase() === ultimaVenda.nome.toLowerCase());
        if (produto) {
            produto.quantidade += ultimaVenda.quantidade;
        } else {
            estoque.push(ultimaVenda);
        }
        atualizarExibicao();
        alert("Última venda desfeita.");
    } else {
        alert("Nenhuma venda para desfazer.");
    }
}

atualizarExibicao();