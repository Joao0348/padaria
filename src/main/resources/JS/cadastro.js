document.getElementById("formCadastro").addEventListener("submit", async function (e) {
    e.preventDefault();

    const usuario = {
        nome: document.getElementById("nome").value,
        cpf: document.getElementById("cpf").value,
        dataNascimento: document.getElementById("dataNascimento").value,
        email: document.getElementById("email").value,
        telefone: document.getElementById("telefone").value
    };

    try {
        const response = await fetch("http://localhost:8080/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario)
        });

        if (response.ok) {
            alert("✅ Usuário cadastrado com sucesso!");
            window.location.href = "produtos.html";
        } else {
            const errorData = await response.json();
            alert("⚠️ Erro ao cadastrar: " + (errorData.message || "Erro desconhecido"));
        }
    } catch (error) {
        alert("⚠️ Erro de conexão com o servidor.");
        console.error(error);
    }
});