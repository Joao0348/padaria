// carrinho.js - Gerenciamento do carrinho com MongoDB

class GerenciadorCarrinho {
    constructor() {
        this.carrinho = [];
        this.total = 0;
        this.formaPagamento = '';
        this.produtos = [];
        this.usuarioLogado = null;

        this.inicializar();
    }

    // Inicializar o carrinho
    inicializar() {
        this.carregarProdutos();
        this.configurarEventos();
        this.verificarUsuarioLogado();
        console.log('🛒 Carrinho inicializado');
    }

    // Verificar se há usuário logado
    verificarUsuarioLogado() {
        const usuarioSalvo = localStorage.getItem('usuarioLogado');
        if (usuarioSalvo) {
            this.usuarioLogado = JSON.parse(usuarioSalvo);
            console.log('👤 Usuário logado:', this.usuarioLogado.email);
        }
    }

    // Carregar produtos do MongoDB
    async carregarProdutos() {
        try {
            console.log('📦 Carregando produtos do MongoDB...');
            const response = await fetch('http://localhost:3000/api/produtos');

            if (!response.ok) {
                throw new Error('Erro ao carregar produtos');
            }

            this.produtos = await response.json();
            this.exibirProdutos();
            console.log('✅ Produtos carregados:', this.produtos.length);

        } catch (error) {
            console.error('❌ Erro ao carregar produtos:', error);
            this.usarProdutosLocais();
        }
    }

    // Fallback para produtos locais
    usarProdutosLocais() {
        this.produtos = [
            { _id: '1', nome: 'Pão Francês', preco: 0.80, imagem: '/imagens/paofrances.png', categoria: 'Pães' },
            { _id: '2', nome: 'Pão de Queijo', preco: 1.50, imagem: '/imagens/622052-pao-de-queijo.png', categoria: 'Salgados' },
            { _id: '3', nome: 'Salgados', preco: 4.00, imagem: '/imagens/Massa-Basica-para-Salgados-Fritos.png', categoria: 'Salgados' },
            { _id: '4', nome: 'Café', preco: 3.00, imagem: '/imagens/cafe.png', categoria: 'Bebidas' },
            { _id: '5', nome: 'Suco de Laranja', preco: 5.00, imagem: '/imagens/suco-laranja.png', categoria: 'Bebidas' },
            { _id: '6', nome: 'Suco de Maracujá', preco: 5.00, imagem: '/imagens/suco-de-maracuja.png', categoria: 'Bebidas' }
        ];
        this.exibirProdutos();
    }

    // Exibir produtos na tela
    exibirProdutos() {
        const gridProdutos = document.getElementById('gridProdutos');
        if (!gridProdutos) return;

        gridProdutos.innerHTML = '';

        this.produtos.forEach(produto => {
            const produtoHTML = `
                <div class="produto">
                    <img src="${produto.imagem}" alt="${produto.nome}" 
                         onerror="this.src='https://via.placeholder.com/300x200?text=${produto.nome}'">
                    <h3>${produto.nome}</h3>
                    <p>R$ ${produto.preco.toFixed(2)}</p>
                    <button onclick="carrinho.adicionarProduto('${produto._id}', '${produto.nome}', ${produto.preco})">
                        Adicionar ao Carrinho
                    </button>
                </div>
            `;
            gridProdutos.innerHTML += produtoHTML;
        });
    }

    // Adicionar produto ao carrinho
    adicionarProduto(id, nome, preco) {
        this.carrinho.push({ id, nome, preco, quantidade: 1 });
        this.total += preco;
        this.atualizarCarrinho();

        // Feedback visual
        const botao = event.target;
        const originalText = botao.textContent;
        botao.textContent = "✓ Adicionado!";
        botao.style.background = "#4CAF50";

        setTimeout(() => {
            botao.textContent = originalText;
            botao.style.background = "";
        }, 1500);

        this.mostrarMensagem(`✅ ${nome} adicionado ao carrinho!`, 'success');
    }

    // Remover item do carrinho
    removerItem(index) {
        const itemRemovido = this.carrinho[index];
        this.total -= itemRemovido.preco * itemRemovido.quantidade;
        this.carrinho.splice(index, 1);
        this.atualizarCarrinho();

        this.mostrarMensagem(`🗑️ ${itemRemovido.nome} removido do carrinho`, 'info');
    }

    // Atualizar quantidade de um item
    atualizarQuantidade(index, novaQuantidade) {
        if (novaQuantidade < 1) {
            this.removerItem(index);
            return;
        }

        const item = this.carrinho[index];
        const diferenca = novaQuantidade - item.quantidade;
        this.total += item.preco * diferenca;
        item.quantidade = novaQuantidade;

        this.atualizarCarrinho();
    }

    // Atualizar interface do carrinho
    atualizarCarrinho() {
        this.atualizarListaCarrinho();
        this.atualizarTotal();
        this.atualizarBotaoFinalizar();
        this.atualizarQRCodePix();
        this.salvarCarrinhoLocal();
    }

    // Atualizar lista de itens no carrinho
    atualizarListaCarrinho() {
        const listaCarrinho = document.getElementById('carrinho');
        if (!listaCarrinho) return;

        listaCarrinho.innerHTML = '';

        this.carrinho.forEach((item, index) => {
            const itemHTML = `
                <li>
                    <div class="item-info">
                        <strong>${item.nome}</strong>
                        <span>R$ ${item.preco.toFixed(2)}</span>
                    </div>
                    <div class="item-controles">
                        <button onclick="carrinho.atualizarQuantidade(${index}, ${item.quantidade - 1})">-</button>
                        <span>${item.quantidade}</span>
                        <button onclick="carrinho.atualizarQuantidade(${index}, ${item.quantidade + 1})">+</button>
                        <button onclick="carrinho.removerItem(${index})" class="btn-remover">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="item-subtotal">
                        R$ ${(item.preco * item.quantidade).toFixed(2)}
                    </div>
                </li>
            `;
            listaCarrinho.innerHTML += itemHTML;
        });
    }

    // Atualizar total
    atualizarTotal() {
        const valorTotal = document.getElementById('valorTotal');
        const valorPix = document.getElementById('valorPix');
        const valorPixCodigo = document.getElementById('valorPixCodigo');

        if (valorTotal) valorTotal.textContent = this.total.toFixed(2);
        if (valorPix) valorPix.textContent = this.total.toFixed(2);
        if (valorPixCodigo) valorPixCodigo.textContent = this.total.toFixed(2);
    }

    // Atualizar botão de finalizar
    atualizarBotaoFinalizar() {
        const finalizarBtn = document.getElementById('finalizarCompra');
        if (!finalizarBtn) return;

        finalizarBtn.disabled = this.carrinho.length === 0 || !this.formaPagamento;
    }

    // Atualizar QR Code do PIX
    atualizarQRCodePix() {
        const qrCodePix = document.getElementById('qrCodePix');
        if (!qrCodePix) return;

        if (this.formaPagamento === 'pix' && this.carrinho.length > 0) {
            qrCodePix.style.display = 'block';
        } else {
            qrCodePix.style.display = 'none';
        }
    }

    // Configurar eventos
    configurarEventos() {
        // Eventos de forma de pagamento
        document.querySelectorAll('input[name="pagamento"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.formaPagamento = e.target.value;
                this.atualizarCarrinho();

                // Atualizar visual da seleção
                document.querySelectorAll('.opcao-pagamento').forEach(opcao => {
                    opcao.classList.remove('selecionado');
                });
                e.target.closest('.opcao-pagamento').classList.add('selecionado');
            });
        });

        // Evento de finalizar compra
        const finalizarBtn = document.getElementById('finalizarCompra');
        if (finalizarBtn) {
            finalizarBtn.addEventListener('click', () => this.finalizarCompra());
        }

        // Carregar carrinho salvo
        this.carregarCarrinhoLocal();
    }

    // Finalizar compra
    async finalizarCompra() {
        if (this.carrinho.length === 0) {
            this.mostrarMensagem('❌ Seu carrinho está vazio!', 'error');
            return;
        }

        if (!this.formaPagamento) {
            this.mostrarMensagem('❌ Selecione uma forma de pagamento!', 'error');
            return;
        }

        // Verificar se usuário está logado
        if (!this.usuarioLogado) {
            const email = prompt('📧 Para finalizar a compra, digite seu email cadastrado:');
            if (!email) {
                this.mostrarMensagem('❌ Email é obrigatório!', 'error');
                return;
            }

            // Buscar usuário pelo email
            try {
                const usuario = await this.buscarUsuarioPorEmail(email);
                if (usuario) {
                    this.usuarioLogado = usuario;
                    localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
                } else {
                    this.mostrarMensagem('❌ Usuário não encontrado. Faça cadastro primeiro!', 'error');
                    return;
                }
            } catch (error) {
                this.mostrarMensagem('❌ Erro ao buscar usuário', 'error');
                return;
            }
        }

        try {
            this.mostrarMensagem('⏳ Finalizando compra...', 'info');

            // Salvar compra no MongoDB
            const compraSalva = await this.salvarCompraNoMongoDB();

            // Mostrar comprovante
            this.mostrarComprovante(compraSalva);

            // Limpar carrinho
            this.limparCarrinho();

            this.mostrarMensagem('✅ Compra finalizada com sucesso!', 'success');

        } catch (error) {
            console.error('Erro ao finalizar compra:', error);
            this.mostrarMensagem('❌ Erro ao finalizar compra: ' + error.message, 'error');
        }
    }

    // Buscar usuário por email
    async buscarUsuarioPorEmail(email) {
        const response = await fetch(`http://localhost:3000/api/usuarios/${email}`);
        if (!response.ok) {
            throw new Error('Usuário não encontrado');
        }
        return await response.json();
    }

    // Salvar compra no MongoDB
    async salvarCompraNoMongoDB() {
        const compraData = {
            usuarioId: this.usuarioLogado._id,
            produtos: this.carrinho.map(item => ({
                produtoId: item.id,
                nome: item.nome,
                preco: item.preco,
                quantidade: item.quantidade
            })),
            valorTotal: this.total,
            formaPagamento: this.formaPagamento,
            dataCompra: new Date().toISOString()
        };

        const response = await fetch('http://localhost:3000/api/compras', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(compraData)
        });

        if (!response.ok) {
            throw new Error('Erro ao salvar compra no banco de dados');
        }

        return await response.json();
    }

    // Mostrar comprovante
    mostrarComprovante(compraSalva) {
        const comprovante = document.getElementById('comprovante');
        const detalhes = document.getElementById('detalhesComprovante');

        if (!comprovante || !detalhes) return;

        const formasPagamento = {
            'pix': 'PIX',
            'debito': 'Cartão de Débito',
            'credito': 'Cartão de Crédito'
        };

        let html = `
            <div class="comprovante-header">
                <h3>📄 Comprovante de Compra</h3>
                <p><strong>Nº do Pedido:</strong> #${compraSalva.compraId || compraSalva._id}</p>
            </div>
            <div class="comprovante-info">
                <p><strong>Data:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Cliente:</strong> ${this.usuarioLogado.nome}</p>
                <p><strong>Email:</strong> ${this.usuarioLogado.email}</p>
                <p><strong>Forma de Pagamento:</strong> ${formasPagamento[this.formaPagamento]}</p>
            </div>
            <div class="comprovante-itens">
                <h4>Itens Comprados:</h4>
                <ul>
                    ${this.carrinho.map(item => `
                        <li>${item.quantidade}x ${item.nome} - R$ ${(item.preco * item.quantidade).toFixed(2)}</li>
                    `).join('')}
                </ul>
            </div>
            <div class="comprovante-total">
                <h4>Total: R$ ${this.total.toFixed(2)}</h4>
            </div>
            <div class="comprovante-obs">
                <p>✅ Compra registrada no sistema</p>
                <p>🕐 Tempo estimado de entrega: 30-45 minutos</p>
            </div>
        `;

        // Adicionar QR Code se for PIX
        if (this.formaPagamento === 'pix') {
            html += `
                <div class="comprovante-pix">
                    <h4>📱 Pagamento via PIX</h4>
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PIX_PADARIA_${Date.now()}" 
                         alt="QR Code PIX">
                    <p>Escaneie o QR Code para pagar</p>
                </div>
            `;
        }

        detalhes.innerHTML = html;
        comprovante.style.display = 'block';
        comprovante.scrollIntoView({ behavior: 'smooth' });
    }

    // Limpar carrinho
    limparCarrinho() {
        this.carrinho = [];
        this.total = 0;
        this.formaPagamento = '';
        this.atualizarCarrinho();

        // Limpar seleção de pagamento
        document.querySelectorAll('input[name="pagamento"]').forEach(radio => {
            radio.checked = false;
        });
        document.querySelectorAll('.opcao-pagamento').forEach(opcao => {
            opcao.classList.remove('selecionado');
        });
    }

    // Salvar carrinho localmente
    salvarCarrinhoLocal() {
        const carrinhoData = {
            itens: this.carrinho,
            total: this.total,
            formaPagamento: this.formaPagamento
        };
        localStorage.setItem('carrinhoPadaria', JSON.stringify(carrinhoData));
    }

    // Carregar carrinho salvo
    carregarCarrinhoLocal() {
        const carrinhoSalvo = localStorage.getItem('carrinhoPadaria');
        if (carrinhoSalvo) {
            const carrinhoData = JSON.parse(carrinhoSalvo);
            this.carrinho = carrinhoData.itens || [];
            this.total = carrinhoData.total || 0;
            this.formaPagamento = carrinhoData.formaPagamento || '';
            this.atualizarCarrinho();
        }
    }

    // Mostrar mensagens
    mostrarMensagem(mensagem, tipo = 'info') {
        // Criar ou usar elemento de mensagem existente
        let mensagemDiv = document.getElementById('mensagem-carrinho');
        if (!mensagemDiv) {
            mensagemDiv = document.createElement('div');
            mensagemDiv.id = 'mensagem-carrinho';
            mensagemDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 5px;
                color: white;
                z-index: 1000;
                font-weight: bold;
                max-width: 300px;
                transition: all 0.3s ease;
            `;
            document.body.appendChild(mensagemDiv);
        }

        // Cor baseada no tipo
        const cores = {
            success: '#2ecc71',
            error: '#e74c3c',
            info: '#3498db',
            warning: '#f39c12'
        };

        mensagemDiv.style.backgroundColor = cores[tipo] || '#3498db';
        mensagemDiv.textContent = mensagem;
        mensagemDiv.style.display = 'block';

        // Auto-esconder após 3 segundos
        setTimeout(() => {
            mensagemDiv.style.display = 'none';
        }, 3000);
    }

    // Métodos utilitários
    getQuantidadeTotal() {
        return this.carrinho.reduce((total, item) => total + item.quantidade, 0);
    }

    getResumoCarrinho() {
        return {
            quantidadeItens: this.getQuantidadeTotal(),
            total: this.total,
            formaPagamento: this.formaPagamento
        };
    }
}

// Inicializar o carrinho quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    window.carrinho = new GerenciadorCarrinho();
});

// Para usar em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GerenciadorCarrinho;
}