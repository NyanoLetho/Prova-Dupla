
const formulario = document.querySelector("form");

formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmar-senha").value;
    const nascimento = document.getElementById("data-nascimento").value;
    const sexo = document.getElementById("sexo").value;
    const termos = document.getElementById("termos").checked;

    if (nome === "" || email === "" || senha === "" || nascimento === "" || sexo === "") {
        alert("Preencha todos os campos obrigatórios.");
    } 
    else if (senha.length < 6) {
        alert("A senha precisa ter pelo menos 6 caracteres.");
    }
    else if (senha !== confirmarSenha) {
        alert("As senhas não são iguais.");
    }
    else if (!termos) {
        alert("Você precisa aceitar os termos.");
    }
    else {
        alert("Inscrição realizada com sucesso!");
        formulario.reset();
    }
});

// Hyano's code hahahaha, eu amo vscode

const abrirInscricao = document.getElementById("hyan-inscricao");
const formularioInscricao = document.getElementById("guilherme-formulario-inscricao");

abrirInscricao.addEventListener("click", function(event) {
    event.preventDefault();

    formularioInscricao.style.display = "block";

    formularioInscricao.scrollIntoView({
        behavior: "smooth"
    });
});