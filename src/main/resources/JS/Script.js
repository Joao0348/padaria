


let carrinho = [];
let total = 0;

function adicionarProduto(nome, preco) {
    carrinho.push({ nome, preco });
    total += preco;
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const lista = document.getElementById("carrinho");
    lista.innerHTML = "";

    carrinho.forEach((item, index) => {
        const li = document.createElement("li");
        li.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)}`;

        // botão remover
        const btnRemover = document.createElement("button");
        btnRemover.textContent = "❌";
        btnRemover.style.marginLeft = "10px";
        btnRemover.onclick = () => removerProduto(index);

        li.appendChild(btnRemover);
        lista.appendChild(li);
    });

    document.getElementById("valorTotal").textContent = total.toFixed(2);
}

function removerProduto(index) {
    total -= carrinho[index].preco;
    carrinho.splice(index, 1);
    atualizarCarrinho();
}

document.getElementById("finalizarCompra").addEventListener("click", () => {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }
    alert(`Compra finalizada! Total: R$ ${total.toFixed(2)}`);
    carrinho = [];
    total = 0;
    atualizarCarrinho();

    document.getElementById("finalizarCompra").addEventListener("click", function() {
        if (carrinho.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }

        let total = carrinho.reduce((acc, item) => acc + item.preco, 0).toFixed(2);

        // Monta os detalhes do comprovante
        let comprovanteHTML = "<ul>";
        carrinho.forEach(item => {
            comprovanteHTML += `<li>${item.nome} - R$ ${item.preco.toFixed(2)}</li>`;
        });
        comprovanteHTML += `</ul><p><strong>Total:</strong> R$ ${total}</p>`;
        comprovanteHTML += `<p><em>Obrigado pela compra! Volte sempre 🥐</em></p>`;

        // Exibe o comprovante na seção
        document.getElementById("detalhesComprovante").innerHTML = comprovanteHTML;
        document.getElementById("comprovante").style.display = "block";

        // Limpa carrinho
        carrinho = [];
        atualizarCarrinho();
    });

});
