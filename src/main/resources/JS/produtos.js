let todosProdutos = [];

// Carregar produtos do backend
async function carregarProdutos() {
    const resposta = await fetch("http://localhost:8080/padaria");
    todosProdutos = await resposta.json();
    exibirProdutos(todosProdutos);
}

function exibirProdutos(lista) {
    const container = document.getElementById("lista-produtos");
    container.innerHTML = "";

    lista.forEach(produto => {
        container.innerHTML += `
            <div class="produto" id="item-${produto.id}">
                <img src="${produto.imagem}" alt="${produto.nome}">
                <h4>${produto.nome}</h4>
                <p>R$ ${produto.preco.toFixed(2)}</p>
                <small class="categoria">${produto.categoria}</small>

                <div class="controle">
                    <button onclick="remover('${produto.id}')">-</button>
                    <span id="qtd-${produto.id}">0</span>
                    <button onclick="adicionar('${produto.id}')">+</button>
                    <button class="comprar" onclick="comprar('${produto.id}')">Adicionar</button>
                </div>
            </div>
        `;
    });
}

// Filtro por categoria
function filtrar(cat) {
    if (cat === "todas") {
        exibirProdutos(todosProdutos);
    } else {
        const filtrados = todosProdutos.filter(p => p.categoria === cat);
        exibirProdutos(filtrados);
    }
}

// + Quantidade
function adicionar(id) {
    const qtd = document.getElementById("qtd-" + id);
    qtd.innerText = parseInt(qtd.innerText) + 1;
}

// - Quantidade
function remover(id) {
    const qtd = document.getElementById("qtd-" + id);
    if (parseInt(qtd.innerText) > 0) {
        qtd.innerText = parseInt(qtd.innerText) - 1;
    }
}

// ✅ FUNÇÃO COMPRAR TOTALMENTE CORRIGIDA
function comprar(id) {
    const qtdSelecionada = parseInt(document.getElementById("qtd-" + id).innerText);
    const card = document.getElementById("item-" + id);
    const nome = card.querySelector("h4").innerText;
    const preco = parseFloat(
        card.querySelector("p").innerText.replace("R$ ", "").replace(",", ".")
    );

    if (qtdSelecionada > 0) {
        let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

        const produtoExistente = carrinho.find(item => item.id === id);

        if (produtoExistente) {
            produtoExistente.qtd += qtdSelecionada;
        } else {
            carrinho.push({ id, nome, qtd: qtdSelecionada, preco });
        }

        localStorage.setItem("carrinho", JSON.stringify(carrinho));

        alert(`✅ ${qtdSelecionada}x ${nome} adicionado(s) ao carrinho!`);
        document.getElementById("qtd-" + id).innerText = 0;
    } else {
        alert("⚠️ Escolha ao menos 1 unidade antes de adicionar!");
    }
}

// ✅ ADICIONAR TODOS CORRIGIDO (SEM DUPLICAR)
function adicionarTodos() {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    let adicionou = false;

    document.querySelectorAll(".produto").forEach(produto => {
        const id = produto.id.replace("item-", "");
        const qtdSelecionada = parseInt(document.getElementById("qtd-" + id).innerText);

        if (qtdSelecionada > 0) {
            const nome = produto.querySelector("h4").innerText;
            const preco = parseFloat(
                produto.querySelector("p").innerText.replace("R$ ", "").replace(",", ".")
            );

            const produtoExistente = carrinho.find(item => item.id === id);

            if (produtoExistente) {
                produtoExistente.qtd += qtdSelecionada;
            } else {
                carrinho.push({ id, nome, qtd: qtdSelecionada, preco });
            }

            document.getElementById("qtd-" + id).innerText = 0;
            adicionou = true;
        }
    });

    if (adicionou) {
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
        alert("🛒 Todos adicionados ao carrinho!");
    } else {
        alert("⚠️ Selecione ao menos 1 produto antes!");
    }
}

// Carregar tudo ao abrir a página
window.onload = carregarProdutos;