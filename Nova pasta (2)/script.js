const CHAVE_CARRINHO = "indieano-carrinho";
const LIMITE_POR_ITEM = 5;
const CUPOM_VALIDO = "INDIE10";
const DESCONTO_CUPOM = 0.1;

const formatarPreco = (valor) => {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const somenteDigitos = (texto) => {
    return texto.replace(/\D/g, "");
};

const listaCarrinho = document.getElementById("hyan-lista-carrinho");
const carrinhoVazio = document.getElementById("hyan-carrinho-vazio");
const contadorHeader = document.getElementById("hyan-contador");
const totalItensEl = document.getElementById("hyan-total-itens");
const totalValorEl = document.getElementById("hyan-total-valor");
const resumoCheckout = document.getElementById("guilherme-resumo-total");
const avisoLoja = document.getElementById("hyan-aviso");
const avisoOfertas = document.getElementById("hyan-aviso-ofertas");
const botaoIrPedido = document.getElementById("hyan-ir-pedido");
const botaoLimpar = document.getElementById("hyan-limpar");

let carrinho = [];

function calcularTotal() {
    let soma = 0;

    for (let i = 0; i < carrinho.length; i++) {
        soma = soma + carrinho[i].preco * carrinho[i].qtd;
    }

    return soma;
}

function contarItens() {
    let soma = 0;

    for (let i = 0; i < carrinho.length; i++) {
        soma = soma + carrinho[i].qtd;
    }

    return soma;
}

function buscarItem(id) {
    for (let i = 0; i < carrinho.length; i++) {
        if (carrinho[i].id === id) {
            return carrinho[i];
        }
    }

    return null;
}

function carregarCarrinho() {
    const salvo = localStorage.getItem(CHAVE_CARRINHO);

    if (salvo !== null) {
        try {
            carrinho = JSON.parse(salvo);
        } catch (erro) {
            carrinho = [];
        }
    }

    if (!Array.isArray(carrinho)) {
        carrinho = [];
    }
}

function salvarCarrinho() {
    localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinho));
}

function mostrarAviso(texto, destino) {
    avisoLoja.textContent = "";
    avisoOfertas.textContent = "";

    if (destino) {
        destino.textContent = texto;
    }
}

function criarBotaoItem(texto, acao, id) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = texto;

    botao.addEventListener("click", function () {
        alterarQuantidade(id, acao);
    });

    return botao;
}

function renderizarCarrinho() {
    listaCarrinho.innerHTML = "";

    for (let i = 0; i < carrinho.length; i++) {
        const item = carrinho[i];

        const li = document.createElement("li");

        const nome = document.createElement("span");
        nome.className = "hyan_item_nome";
        nome.textContent = item.nome;

        const controles = document.createElement("div");
        controles.className = "hyan_item_controles";

        const quantidade = document.createElement("span");
        quantidade.textContent = item.qtd;

        controles.appendChild(criarBotaoItem("−", "diminuir", item.id));
        controles.appendChild(quantidade);
        controles.appendChild(criarBotaoItem("+", "aumentar", item.id));
        controles.appendChild(criarBotaoItem("×", "remover", item.id));

        const preco = document.createElement("span");
        preco.className = "hyan_item_preco";
        preco.textContent = formatarPreco(item.preco * item.qtd);

        li.appendChild(nome);
        li.appendChild(controles);
        li.appendChild(preco);
        listaCarrinho.appendChild(li);
    }

    const total = formatarPreco(calcularTotal());

    carrinhoVazio.hidden = carrinho.length > 0;
    contadorHeader.textContent = contarItens();
    totalItensEl.textContent = contarItens();
    totalValorEl.textContent = total;
    resumoCheckout.textContent = total;
    botaoIrPedido.disabled = carrinho.length === 0;
    botaoLimpar.disabled = carrinho.length === 0;

    salvarCarrinho();
}

function adicionarAoCarrinho(id, nome, preco, destinoAviso) {
    const existente = buscarItem(id);

    if (existente && existente.qtd >= LIMITE_POR_ITEM) {
        mostrarAviso("Limite de " + LIMITE_POR_ITEM + " unidades por jogo atingido.", destinoAviso);
        return;
    }

    if (existente) {
        existente.qtd++;
    } else {
        carrinho.push({ id: id, nome: nome, preco: preco, qtd: 1 });
    }

    mostrarAviso(nome + " foi adicionado ao carrinho.", destinoAviso);
    renderizarCarrinho();
}

function alterarQuantidade(id, acao) {
    const item = buscarItem(id);

    if (item === null) {
        return;
    }

    if (acao === "aumentar" && item.qtd < LIMITE_POR_ITEM) {
        item.qtd++;
    } else if (acao === "diminuir") {
        item.qtd--;
    } else if (acao === "remover") {
        item.qtd = 0;
    }

    if (item.qtd <= 0) {
        carrinho.splice(carrinho.indexOf(item), 1);
    }

    renderizarCarrinho();
}

const botoesProduto = document.querySelectorAll("[data-produto]");

for (let i = 0; i < botoesProduto.length; i++) {
    const botao = botoesProduto[i];

    botao.addEventListener("click", () => {
        adicionarAoCarrinho(botao.dataset.id, botao.dataset.nome, Number(botao.dataset.preco), avisoLoja);
    });
}

botaoLimpar.addEventListener("click", function () {
    carrinho = [];
    renderizarCarrinho();
});

const botoesCombo = document.querySelectorAll("[data-combo]");

for (let i = 0; i < botoesCombo.length; i++) {
    const botaoCombo = botoesCombo[i];

    botaoCombo.addEventListener("click", function () {
        const ids = botaoCombo.dataset.combo.split(",");

        for (let j = 0; j < ids.length; j++) {
            for (let k = 0; k < botoesProduto.length; k++) {
                const produto = botoesProduto[k];

                if (produto.dataset.id === ids[j]) {
                    adicionarAoCarrinho(produto.dataset.id, produto.dataset.nome, Number(produto.dataset.preco), avisoOfertas);
                }
            }
        }

        mostrarAviso("Combo adicionado ao carrinho.", avisoOfertas);
    });
}

const modal = document.getElementById("hyan-modal");
const tituloModal = document.getElementById("hyan-modal-titulo");
const etapaCarrinho = document.getElementById("hyan-etapa-carrinho");
const etapaPedido = document.getElementById("hyan-etapa-pedido");

function mostrarEtapa(etapa) {
    if (etapa === "pedido") {
        etapaCarrinho.hidden = true;
        etapaPedido.hidden = false;
        tituloModal.textContent = "Finalizar pedido";
    } else {
        etapaCarrinho.hidden = false;
        etapaPedido.hidden = true;
        tituloModal.textContent = "Seu carrinho";
    }

    modal.scrollTop = 0;
}

function abrirModal() {
    mostrarEtapa("carrinho");

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

document.getElementById("hyan-abrir-carrinho").addEventListener("click", abrirModal);
document.getElementById("hyan-fechar-modal").addEventListener("click", fecharModal);
document.getElementById("hyan-voltar-carrinho").addEventListener("click", () => mostrarEtapa("carrinho"));
botaoIrPedido.addEventListener("click", () => mostrarEtapa("pedido"));

const botoesAbrirModal = document.querySelectorAll("[data-abrir-modal]");

for (let i = 0; i < botoesAbrirModal.length; i++) {
    botoesAbrirModal[i].addEventListener("click", abrirModal);
}

const linksFecharModal = document.querySelectorAll("[data-fechar-modal]");

for (let i = 0; i < linksFecharModal.length; i++) {
    linksFecharModal[i].addEventListener("click", fecharModal);
}

modal.addEventListener("click", function (evento) {
    if (evento.target === modal) {
        fecharModal();
    }
});

modal.addEventListener("close", function () {
    document.body.classList.remove("modal-aberto");
});

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

document.getElementById("hyan-anterior").addEventListener("click", () => mostrarSlide(slideAtual - 1));
document.getElementById("hyan-proximo").addEventListener("click", () => mostrarSlide(slideAtual + 1));

const itensFaq = document.querySelectorAll(".guilherme_faq_item");
const categoriasFaq = document.querySelectorAll(".guilherme_faq_categoria");
const buscaFaq = document.getElementById("busca-perguntas");
const mensagemFaq = document.getElementById("hyan-mensagem-perguntas");

function fecharItemFaq(item) {
    item.classList.remove("ativo");
    item.querySelector("span").textContent = "+";
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
        const texto = item.textContent.toLowerCase();

        if (texto.includes(pesquisa)) {
            item.classList.remove("oculto");
            encontrados++;
        } else {
            item.classList.add("oculto");
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

        if (visiveis === 0) {
            categoriasFaq[i].classList.add("oculto");
        } else {
            categoriasFaq[i].classList.remove("oculto");
        }
    }

    mensagemFaq.hidden = encontrados > 0;
});

const formularioPedido = document.getElementById("guilherme-form-pedido");

function cpfValido(cpf) {
    if (cpf.length !== 11) {
        return false;
    }

    let todosIguais = true;

    for (let i = 1; i < 11; i++) {
        if (cpf[i] !== cpf[0]) {
            todosIguais = false;
        }
    }

    if (todosIguais) {
        return false;
    }

    for (let tamanho = 9; tamanho < 11; tamanho++) {
        let soma = 0;

        for (let i = 0; i < tamanho; i++) {
            soma = soma + Number(cpf[i]) * (tamanho + 1 - i);
        }

        const digito = ((soma * 10) % 11) % 10;

        if (digito !== Number(cpf[tamanho])) {
            return false;
        }
    }

    return true;
}

function calcularIdade(dataTexto) {
    const hoje = new Date();
    const nascimento = new Date(dataTexto + "T00:00:00");
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }

    return idade;
}

function validarPedido(evento) {
    evento.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const cpf = somenteDigitos(document.getElementById("cpf").value);
    const telefone = somenteDigitos(document.getElementById("telefone").value);
    const nascimento = document.getElementById("nascimento").value;
    const plataforma = document.getElementById("plataforma").value;
    const cep = somenteDigitos(document.getElementById("cep").value);
    const endereco = document.getElementById("endereco").value.trim();
    const numero = Number(document.getElementById("numero").value);
    const cidade = document.getElementById("cidade").value.trim();
    const estado = document.getElementById("estado").value;
    const pagamento = document.querySelector('input[name="pagamento"]:checked');
    const cupom = document.getElementById("cupom").value.trim().toUpperCase();
    const observacoes = document.getElementById("observacoes").value.trim();
    const termos = document.getElementById("termos").checked;

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const regexNome = /^[A-Za-zÀ-ÿ' ]+$/;
    let idade = 0;

    if (nascimento !== "") {
        idade = calcularIdade(nascimento);
    }

    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio. Adicione pelo menos um jogo antes de finalizar.");
    }
    else if (nome === "" || nome.split(/\s+/).length < 2 || !regexNome.test(nome)) {
        alert("Informe nome e sobrenome, usando apenas letras.");
    }
    else if (!regexEmail.test(email)) {
        alert("Informe um e-mail válido, como nome@exemplo.com.");
    }
    else if (!cpfValido(cpf)) {
        alert("CPF inválido. Digite os 11 números corretamente.");
    }
    else if (telefone.length < 10 || telefone.length > 11) {
        alert("Informe o telefone com DDD (10 ou 11 números).");
    }
    else if (nascimento === "") {
        alert("Informe sua data de nascimento.");
    }
    else if (isNaN(idade) || idade < 0 || idade > 120) {
        alert("A data de nascimento informada não é válida.");
    }
    else if (idade < 18) {
        alert("É preciso ter 18 anos ou mais para finalizar a compra.");
    }
    else if (plataforma === "") {
        alert("Escolha a plataforma do jogo.");
    }
    else if (cep.length !== 8) {
        alert("O CEP deve ter 8 números.");
    }
    else if (endereco.length < 3) {
        alert("Informe o nome da rua.");
    }
    else if (!Number.isInteger(numero) || numero <= 0) {
        alert("Informe um número de endereço válido, maior que zero.");
    }
    else if (cidade.length < 2) {
        alert("Informe a cidade.");
    }
    else if (estado === "") {
        alert("Escolha o estado.");
    }
    else if (!pagamento) {
        alert("Escolha uma forma de pagamento.");
    }
    else if (cupom !== "" && cupom !== CUPOM_VALIDO) {
        alert("Cupom inválido. Deixe o campo em branco ou use " + CUPOM_VALIDO + ".");
    }
    else if (observacoes.length > 300) {
        alert("As observações devem ter no máximo 300 caracteres.");
    }
    else if (!termos) {
        alert("Você precisa aceitar os termos para continuar.");
    }
    else {
        let desconto = 0;

        if (cupom === CUPOM_VALIDO) {
            desconto = DESCONTO_CUPOM;
        }

        const totalFinal = calcularTotal() * (1 - desconto);
        let mensagem = "Pedido confirmado, " + nome.split(/\s+/)[0] + "!\n";
        mensagem = mensagem + "Total: " + formatarPreco(totalFinal);

        if (desconto > 0) {
            mensagem = mensagem + " (cupom " + CUPOM_VALIDO + " aplicado)";
        }

        mensagem = mensagem + "\nA chave digital seria enviada para " + email + ". (Pedido demonstrativo)";
        alert(mensagem);

        formularioPedido.reset();
        carrinho = [];
        renderizarCarrinho();
        mostrarAviso("", null);
        mostrarEtapa("carrinho");
        fecharModal();
    }
}

formularioPedido.addEventListener("submit", validarPedido);

carregarCarrinho();
renderizarCarrinho();
mostrarSlide(0);
