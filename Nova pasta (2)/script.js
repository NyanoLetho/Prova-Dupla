// Modal de inscrição
const modal = document.getElementById("hyan-modal");
const botaoFecharModal = document.getElementById("hyan-fechar-modal");
const botoesAbrirModal = document.querySelectorAll("[data-abrir-inscricao]");
const formularioInscricao = document.getElementById("form-inscricao");

function abrirModal() {
    if (!modal.open) {
        modal.showModal();
        document.body.classList.add("modal-aberto");
    }
}

function fecharModal() {
    if (modal.open) {
        modal.close();
    }
}

for (let i = 0; i < botoesAbrirModal.length; i++) {
    botoesAbrirModal[i].addEventListener("click", abrirModal);
}

botaoFecharModal.addEventListener("click", fecharModal);

modal.addEventListener("click", function (evento) {
    if (evento.target === modal) {
        fecharModal();
    }
});

modal.addEventListener("close", function () {
    document.body.classList.remove("modal-aberto");
});

formularioInscricao.addEventListener("submit", function (evento) {
    evento.preventDefault();

    if (!formularioInscricao.checkValidity()) {
        formularioInscricao.reportValidity();
        return;
    }

    const nome = document.getElementById("inscricao-nome").value.trim();
    const email = document.getElementById("inscricao-email").value.trim();
    const genero = document.getElementById("inscricao-genero").value;
    const telefone = document.getElementById("inscricao-telefone").value.trim();

    if (nome.length < 3) {
        alert("Informe seu nome completo.");
        return;
    }

    if (telefone.replace(/\\D/g, "").length < 10) {
        alert("Informe um telefone com DDD válido.");
        return;
    }

    let mensagem = "Inscrição realizada com sucesso, " + nome + "!\\n";
    mensagem += "E-mail cadastrado: " + email + ".";
    if (genero !== "") {
        mensagem += "\\nGênero favorito: " + genero + ".";
    }
    mensagem += "\\nEsta é uma demonstração acadêmica; nenhum dado foi enviado.";

    alert(mensagem);
    formularioInscricao.reset();
    fecharModal();
});

// Carrossel de novidades
const slides = [
    {
        imagem: "img/terraria.jpg",
        legenda: "Terraria: sandbox 2D de exploração, mineração e combate, para jogar solo ou online."
    },
    {
        imagem: "img/hollowknight.jpg",
        legenda: "Hollow Knight: explore um reino subterrâneo cheio de segredos e chefes desafiadores."
    },
    {
        imagem: "img/stardewvalley.jpg",
        legenda: "Stardew Valley: cultive, pesque, faça amizades e monte sua fazenda dos sonhos."
    },
    {
        imagem: "img/cuphead.jpg",
        legenda: "Cuphead: ação com chefes e visual de desenho animado dos anos 1930."
    }
];

let slideAtual = 0;
const imagemCarrossel = document.getElementById("hyan-imagem-carrossel");
const legendaCarrossel = document.getElementById("hyan-legenda-carrossel");
const contadorCarrossel = document.getElementById("hyan-contador-carrossel");

function mostrarSlide(indice) {
    if (indice < 0) {
        indice = slides.length - 1;
    }

    if (indice >= slides.length) {
        indice = 0;
    }

    slideAtual = indice;
    imagemCarrossel.src = slides[slideAtual].imagem;
    imagemCarrossel.alt = slides[slideAtual].legenda;
    legendaCarrossel.textContent = slides[slideAtual].legenda;
    contadorCarrossel.textContent = (slideAtual + 1) + "/" + slides.length;
}

document.getElementById("hyan-anterior").addEventListener("click", function () {
    mostrarSlide(slideAtual - 1);
});

document.getElementById("hyan-proximo").addEventListener("click", function () {
    mostrarSlide(slideAtual + 1);
});

// Busca e abertura das perguntas frequentes
const itensFaq = document.querySelectorAll(".guilherme_faq_item");
const categoriasFaq = document.querySelectorAll(".guilherme_faq_categoria");
const buscaFaq = document.getElementById("busca-perguntas");
const mensagemFaq = document.getElementById("hyan-mensagem-perguntas");

function fecharItemFaq(item) {
    item.classList.remove("ativo");
    const indicador = item.querySelector("span");
    if (indicador) {
        indicador.textContent = "+";
    }
}

for (let i = 0; i < itensFaq.length; i++) {
    const item = itensFaq[i];
    const botao = item.querySelector(".guilherme_faq_botao");

    botao.addEventListener("click", function () {
        const estavaAberto = item.classList.contains("ativo");

        for (let j = 0; j < itensFaq.length; j++) {
            fecharItemFaq(itensFaq[j]);
        }

        if (!estavaAberto) {
            item.classList.add("ativo");
            botao.querySelector("span").textContent = "−";
        }
    });
}

buscaFaq.addEventListener("input", function () {
    const pesquisa = buscaFaq.value.toLowerCase().trim();
    let encontrados = 0;

    for (let i = 0; i < itensFaq.length; i++) {
        const item = itensFaq[i];
        const corresponde = item.textContent.toLowerCase().includes(pesquisa);

        item.classList.toggle("oculto", !corresponde);
        if (corresponde) {
            encontrados++;
        } else {
            fecharItemFaq(item);
        }
    }

    for (let i = 0; i < categoriasFaq.length; i++) {
        const itensDaCategoria = categoriasFaq[i].querySelectorAll(".guilherme_faq_item");
        let visiveis = 0;

        for (let j = 0; j < itensDaCategoria.length; j++) {
            if (!itensDaCategoria[j].classList.contains("oculto")) {
                visiveis++;
            }
        }

        categoriasFaq[i].classList.toggle("oculto", visiveis === 0);
    }

    mensagemFaq.hidden = encontrados > 0;
});

mostrarSlide(0);
