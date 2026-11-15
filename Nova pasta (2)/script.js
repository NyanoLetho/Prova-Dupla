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
  else if (!email.includes("@")) {
    alert("O email precisa ter seu @.");
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

// FAQ


const itensPerguntas = document.querySelectorAll(".item-pergunta");
const buscaPerguntas = document.getElementById("busca-perguntas");
const mensagemPerguntas = document.getElementById("mensagem-perguntas");

itensPerguntas.forEach(function(item) {
    const botao = item.querySelector(".botao-pergunta");

    botao.addEventListener("click", function() {
        const estavaAberta = item.classList.contains("ativo");

        itensPerguntas.forEach(function(pergunta) {
            pergunta.classList.remove("ativo");
            pergunta.querySelector("span").textContent = "+";
        });

        if (!estavaAberta) {
            item.classList.add("ativo");
            botao.querySelector("span").textContent = "-";
        }
    });
});

buscaPerguntas.addEventListener("input", function() {
    const pesquisa = buscaPerguntas.value.toLowerCase().trim();
    let encontrados = 0;

    itensPerguntas.forEach(function(item) {
        const texto = item.textContent.toLowerCase();

        if (texto.includes(pesquisa)) {
            item.style.display = "block";
            encontrados++;
        } else {
            item.style.display = "none";
            item.classList.remove("ativo");
            item.querySelector("span").textContent = "+";
        }
    });

    document.querySelectorAll(".categoria-perguntas").forEach(function(categoria) {
        const visiveis = categoria.querySelectorAll(".item-pergunta:not([style*='display: none'])");

        categoria.style.display = visiveis.length > 0 ? "block" : "none";
    });

    mensagemPerguntas.style.display = encontrados === 0 ? "block" : "none";
});

// Carrossel

const imagensCarrossel = [
    {
        imagem: "img/banterraria.jfif",
        legenda: "Terraria é um jogo sandbox 2D de exploração, mineração e combate. Você constrói, luta contra chefes e desbloqueia novos biomas e itens. Tem 4 estilos de combate e mais de 5.000 itens para descobrir.Joga solo ou online, disponível em PC, console e celular."
    },
    {
        imagem: "img/#",
        legenda: "%"
    },
    {
        imagem: "img/#",
        legenda: "%"
    },
    {
        imagem: "img/#",
        legenda: "%"
    }
];

let indiceAtual = 0;

const imagemCarrossel = document.getElementById("imagem-carrossel");
const legendaCarrossel = document.getElementById("legenda-carrossel");
const contadorCarrossel = document.getElementById("contador-carrossel");
const botaoAnterior = document.getElementById("anterior");
const botaoProximo = document.getElementById("proximo");

function atualizarCarrossel() {
    imagemCarrossel.src = imagensCarrossel[indiceAtual].imagem;
    imagemCarrossel.alt = imagensCarrossel[indiceAtual].legenda;
    legendaCarrossel.textContent = imagensCarrossel[indiceAtual].legenda;

    contadorCarrossel.textContent = (indiceAtual + 1) + "/" + imagensCarrossel.length;

    botaoAnterior.disabled = indiceAtual === 0;
    botaoProximo.disabled = indiceAtual === imagensCarrossel.length - 1;
}

botaoAnterior.addEventListener("click", function() {
    if (indiceAtual > 0) {
        indiceAtual--;
        atualizarCarrossel();
    }
});

botaoProximo.addEventListener("click", function() {
    if (indiceAtual < imagensCarrossel.length - 1) {
        indiceAtual++;
        atualizarCarrossel();
    }
});

const arquivoImagem = document.getElementById("arquivo-imagem");
const legendaNova = document.getElementById("legenda-nova");
const botaoAdicionarImagem = document.getElementById("adicionar-imagem");

botaoAdicionarImagem.addEventListener("click", function() {
    const arquivo = arquivoImagem.files[0];
    const legenda = legendaNova.value.trim();

    if (!arquivo || legenda === "") {
        alert("Escolha uma imagem e escreva uma legenda.");
    }
    else if (!arquivo.type.startsWith("image/")) {
        alert("Escolha um arquivo de imagem válido.");
    }
    else {
        const novaImagem = URL.createObjectURL(arquivo);

        imagensCarrossel.push({
            imagem: novaImagem,
            legenda: legenda
        });

        indiceAtual = imagensCarrossel.length - 1;

        atualizarCarrossel();

        arquivoImagem.value = "";
        legendaNova.value = "";

        alert("Imagem adicionada com sucesso!");
    }
});

atualizarCarrossel();
