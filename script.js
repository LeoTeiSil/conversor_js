const chaveAPI = "3878d52fe5043a4a7306e404";

const campoValor = document.getElementById("valor");
const moedaOrigem = document.getElementById("moedaOrigem");
const moedaDestino = document.getElementById("moedaDestino");
const botaoConverter = document.querySelector(".botao-converter");
const resultado = document.querySelector(".resultado");
const erro = document.querySelector(".erro");
const taxaCambio = document.querySelector(".taxa-cambio");

const tradutor = new Intl.DisplayNames(["pt-BR"], { type: "currency" });

function carregarMoedas() {
  const url = `https://v6.exchangerate-api.com/v6/${chaveAPI}/codes`;

  fetch(url)
    .then(resposta => resposta.json())
    .then(dados => {
      const lista = dados.supported_codes;

      lista.forEach(moeda => {
        const codigo = moeda[0];
        let nomeTraduzido;

        try {
          nomeTraduzido = tradutor.of(codigo);
        } catch {
          nomeTraduzido = moeda[1]; 
        }

        const opcaoOrigem = document.createElement("option");
        opcaoOrigem.value = codigo;
        opcaoOrigem.textContent = `${codigo} - ${nomeTraduzido}`;
        moedaOrigem.appendChild(opcaoOrigem);

        const opcaoDestino = document.createElement("option");
        opcaoDestino.value = codigo;
        opcaoDestino.textContent = `${codigo} - ${nomeTraduzido}`;
        moedaDestino.appendChild(opcaoDestino);
      });

      moedaOrigem.value = "USD";
      moedaDestino.value = "BRL";
    })
    .catch(() => {
      erro.textContent = "Erro ao carregar as moedas.";
    });
}

carregarMoedas();

botaoConverter.addEventListener("click", function () {
  const valor = campoValor.value;
  const de = moedaOrigem.value;
  const para = moedaDestino.value;

  if (valor !== "" && parseFloat(valor) > 0) {
    const url = `https://v6.exchangerate-api.com/v6/${chaveAPI}/pair/${de}/${para}`;

    fetch(url)
      .then(resposta => resposta.json())
      .then(dados => {
        if (dados.result === "success") {
          const taxa = dados.conversion_rate;
          const valorConvertido = (valor * taxa).toFixed(2);
          resultado.textContent = `${valor} ${de} = ${valorConvertido} ${para}`;
          taxaCambio.textContent = `1 ${de} = ${taxa} ${para}`;
          erro.textContent = "";
        } else {
          erro.textContent = "Não foi possível converter.";
        }
      })
      .catch(() => {
        erro.textContent = "Erro na conexão com a API.";
      });
  } else {
    alert("Digite um valor válido maior que 0.");
  }
});