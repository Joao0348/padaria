document.getElementById("cadastroForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const cpf = document.getElementById("cpf").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;
    const dataNascimento = document.getElementById("dataNascimento").value;

    const usuario = {
        nome: nome,
        cpf: cpf,
        email: email,
        telefone: telefone,
        dataNascimento: dataNascimento
    };

    fetch("http://localhost:8080/usuarios", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(usuario)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao cadastrar");
            }
            return response.text(); // Para casos onde a API não retorna JSON
        })
        .then(() => {
            document.getElementById("mensagem").style.color = "#2ecc71";
            document.getElementById("mensagem").innerText =


            document.getElementById("cadastroForm").reset();

            setTimeout(() => {
                window.location.href = "menu.html"; // <- Caminho da sua página de menu
            }, 2000); // 2 segundos de espera
        })
        .catch(error => {
            document.getElementById("mensagem").style.color = "#e74c3c";
            document.getElementById("mensagem").innerText = "❌ Erro ao cadastrar usuário.";
            console.error("Erro:", error);
        });
});