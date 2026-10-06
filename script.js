const $ = (id) => document.getElementById(id);

const corpo = document.body;
const botaoTema = $("tema");
const campoTelefone = $("telefone");
const formulario = $("form");
const campoMensagem = $("mensagem");
const contador = $("contador");
const modal = $("modal");
const modalTitulo = $("modal-titulo");
const modalTexto = $("modal-texto");
const fecharModal = $("fechar-modal");
const modalOk = $("modal-ok");

function aplicarTema(tema) {
  const escuro = tema === "escuro";

  corpo.classList.toggle("escuro", escuro);

  botaoTema.textContent = escuro ? "☀️" : "🌙";

  botaoTema.setAttribute(
    "aria-label",
    escuro ? "Ativar modo claro" : "Ativar modo escuro"
  );

  botaoTema.setAttribute(
    "title",
    escuro ? "Ativar modo claro" : "Ativar modo escuro"
  );
}

let temaSalvo = "claro";

try {
  temaSalvo = localStorage.getItem("tema") || "claro";
} catch (erro) {
  temaSalvo = "claro";
}

aplicarTema(temaSalvo);

botaoTema.addEventListener("click", () => {
  const novoTema = corpo.classList.contains("escuro")
    ? "claro"
    : "escuro";

  aplicarTema(novoTema);

  try {
    localStorage.setItem("tema", novoTema);
  } catch (erro) {}
});


const digitando = $("digitando");

const frases = digitando.dataset.frases
  .split("|")
  .map((frase) => frase.trim())
  .filter(Boolean);

let indiceFrase = 0;
let indiceLetra = 0;
let apagando = false;

function digitar() {
  const fraseAtual = frases[indiceFrase];

  if (apagando) {
    indiceLetra -= 1;
  } else {
    indiceLetra += 1;
  }

  digitando.textContent = fraseAtual.slice(0, indiceLetra);

  let tempo = apagando ? 45 : 85;

  if (!apagando && indiceLetra === fraseAtual.length) {
    apagando = true;
    tempo = 1300;
  }

  if (apagando && indiceLetra === 0) {
    apagando = false;
    indiceFrase = (indiceFrase + 1) % frases.length;
    tempo = 250;
  }

  setTimeout(digitar, tempo);
}

digitar();


const observador = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visivel");
        observador.unobserve(entrada.target);
      }
    });
  },
  {
    threshold: 0.12
  }
);

document.querySelectorAll(".revelar").forEach((secao) => {
  observador.observe(secao);
});


function abrirModal(titulo, texto) {
  modalTitulo.textContent = titulo;
  modalTexto.textContent = texto;

  if (typeof modal.showModal === "function") {
    modal.showModal();
  } else {
    modal.setAttribute("open", "");
  }
}

function fecharJanela() {
  if (typeof modal.close === "function") {
    modal.close();
  } else {
    modal.removeAttribute("open");
  }
}


document.querySelectorAll("[data-detalhes]").forEach((botao) => {
  botao.addEventListener("click", () => {
    abrirModal(
      botao.dataset.titulo,
      botao.dataset.detalhes
    );
  });
});

fecharModal.addEventListener("click", fecharJanela);

modalOk.addEventListener("click", fecharJanela);

modal.addEventListener("click", (evento) => {
  if (evento.target === modal) {
    fecharJanela();
  }
});


campoTelefone.addEventListener("input", (evento) => {
  const numeros = evento.target.value
    .replace(/\D/g, "")
    .slice(0, 11);

  let valor = numeros;

  if (numeros.length > 0) {
    valor = `(${numeros.slice(0, 2)}`;
  }

  if (numeros.length >= 3) {
    valor += `) ${numeros.slice(2, 7)}`;
  }

  if (numeros.length >= 8) {
    valor += `-${numeros.slice(7, 11)}`;
  }

  evento.target.value = valor;
});


function atualizarContador() {
  contador.textContent =
    `${campoMensagem.value.length}/500`;
}

campoMensagem.addEventListener(
  "input",
  atualizarContador
);

atualizarContador();


formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nome = $("nome").value.trim();

  const telefone = $("telefone")
    .value
    .replace(/\D/g, "");

  const email = $("email")
    .value
    .trim();

  const mensagem = $("mensagem")
    .value
    .trim();

  const erro = $("erro");

  erro.textContent = "";

  if (nome.length < 2) {
    erro.textContent = "Digite seu nome.";
    $("nome").focus();
    return;
  }

  if (telefone.length < 10) {
    erro.textContent =
      "Digite um telefone válido com DDD.";

    campoTelefone.focus();
    return;
  }

  const emailValido =
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);

  if (!emailValido) {
    erro.textContent =
      "Digite um e-mail válido.";

    $("email").focus();
    return;
  }

  if (mensagem.length < 10) {
    erro.textContent =
      "Escreva pelo menos 10 caracteres na mensagem.";

    campoMensagem.focus();
    return;
  }

  abrirModal(
    "Mensagem enviada",
    "Obrigado pelo contato! Seu formulário foi validado com sucesso."
  );

  formulario.reset();

  atualizarContador();
});