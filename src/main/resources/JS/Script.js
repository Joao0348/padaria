// ✅ Recupera o total do carrinho
const totalCompra = parseFloat(localStorage.getItem("totalCompra")) || 0;

document.getElementById("total-compra").innerText =
    "R$ " + totalCompra.toFixed(2);

// ✅ Mostrar PIX
function mostrarPix() {
    document.getElementById("pix-section").style.display = "block";
    document.getElementById("dinheiro-section").style.display = "none";
    document.getElementById("nota-fiscal").style.display = "none";
}

// ✅ Mostrar Dinheiro
function mostrarDinheiro() {
    document.getElementById("dinheiro-section").style.display = "block";
    document.getElementById("pix-section").style.display = "none";
    document.getElementById("nota-fiscal").style.display = "none";
}

// ✅ Calcular troco corretamente
function calcularTroco() {
    const valorPago = parseFloat(document.getElementById("valorCliente").value);

    if (isNaN(valorPago) || valorPago < totalCompra) {
        document.getElementById("resultadoTroco").innerText =
            "⚠️ Valor insuficiente!";
        return;
    }

    const troco = valorPago - totalCompra;

    document.getElementById("resultadoTroco").innerText =
        "Troco: R$ " + troco.toFixed(2);
}

// ✅ CONFIRMAR PAGAMENTO + SALVAR NO BACKEND (CORRIGIDO)
async function confirmarPagamento(tipo) {

    if (tipo === "Dinheiro") {
        const valorPago = parseFloat(document.getElementById("valorCliente").value);

        if (isNaN(valorPago) || valorPago < totalCompra) {
            alert("⚠️ Valor insuficiente!");
            return;
        }
    }

    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const usuarioId = localStorage.getItem("usuarioId");

    if (!usuarioId) {
        alert("⚠️ Usuário não identificado!");
        return;
    }

    if (carrinho.length === 0) {
        alert("⚠️ Carrinho vazio!");
        return;
    }

    // ✅ AGORA ENVIA APENAS OS IDS ÚNICOS
    const produtosIds = carrinho.map(item => item.id);

    // ✅ QUANTIDADE TOTAL REAL
    const quantidadeTotal = carrinho.reduce(
        (soma, item) => soma + item.qtd,
        0
    );

    const compraDTO = {
        usuarioId: usuarioId,
        produtosIds: produtosIds,  // ✅ sem duplicação
        quantidade: quantidadeTotal, // ✅ quantidade real
        valorTotal: totalCompra,
    };

    try {
        const response = await fetch("http://localhost:8080/compras", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(compraDTO),
        });

        if (!response.ok) {
            throw new Error("Erro ao salvar a compra");
        }

        const compraSalva = await response.json();
        console.log("✅ Compra salva:", compraSalva);

        gerarNotaFiscal(tipo);

        alert(`✅ Pagamento via ${tipo} confirmado!`);

        document.getElementById("nota-fiscal").style.display = "block";
        document.getElementById("pix-section").style.display = "none";
        document.getElementById("dinheiro-section").style.display = "none";

    } catch (error) {
        console.error(error);
        alert("❌ Erro ao registrar a compra no sistema.");
    }
}

// ✅ GERAR NOTA FISCAL (ORGANIZADA)
function gerarNotaFiscal(tipoPagamento) {

    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const agora = new Date();

    let htmlNota = `
    <div class="nota-fiscal-content" style="
        max-width: 400px;
        margin: 0 auto;
        padding: 20px;
        border: 2px dashed #333;
        border-radius: 10px;
        background: #fff;
        font-family: monospace;
    ">
        <h2 style="text-align:center;">🧾 NOTA FISCAL</h2>

        <p style="text-align:center; font-weight:bold;">
            Padaria Medeiros
        </p>

        <p style="text-align:center; font-size:14px;">
            CNPJ: 12.345.678/0001-90
        </p>

        <hr>

        <p><strong>Data:</strong> ${agora.toLocaleDateString()} ${agora.toLocaleTimeString()}</p>

        <p><strong>Forma de Pagamento:</strong> ${tipoPagamento}</p>

        <hr>

        <h4>🛒 Itens Comprados</h4>
    `;

    carrinho.forEach(item => {
        const subtotal = item.qtd * item.preco;

        htmlNota += `
        <div style="display:flex; justify-content:space-between;">
            <span>${item.qtd}x ${item.nome}</span>
            <span>R$ ${subtotal.toFixed(2)}</span>
        </div>
        `;
    });

    htmlNota += `
        <hr>

        <div style="display:flex; justify-content:space-between; font-size:18px;">
            <strong>Total:</strong>
            <strong>R$ ${totalCompra.toFixed(2)}</strong>
        </div>
    `;

    if (tipoPagamento === "Dinheiro") {
        const valorPago =
            parseFloat(document.getElementById("valorCliente").value) || totalCompra;

        const troco = valorPago - totalCompra;

        htmlNota += `
        <hr>
        <p><strong>Valor Pago:</strong> R$ ${valorPago.toFixed(2)}</p>
        <p><strong>Troco:</strong> R$ ${troco.toFixed(2)}</p>
        `;
    }

    htmlNota += `
        <hr>

        <p style="text-align:center; margin-top:15px;">
            🥖 Obrigado pela preferência!<br>
            Volte sempre!
        </p>
    </div>
    `;

    document.getElementById("detalhes-nota").innerHTML = htmlNota;
}

// ✅ FINALIZAR COMPRA
function finalizar() {

    alert("🎉 Pedido concluído! Obrigado por comprar na Padaria Medeiros.");

    localStorage.removeItem("carrinho");
    localStorage.removeItem("totalCompra");

    window.location.href = "produtos.html";
}