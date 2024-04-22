const btnProcessar = document.querySelector('#btnProcessar');
const txtInput = document.querySelector('#txtInput');
const txtOutput = document.querySelector('#txtOutput');

const emojiParaTexto = {
  "0️⃣": "0",
  "1️⃣": "1",
  "2️⃣": "2",
  "3️⃣": "3",
  "4️⃣": "4",
  "5️⃣": "5",
  "6️⃣": "6",
  "7️⃣": "7",
  "8️⃣": "8",
  "9️⃣": "9",
  "🔟": "10",
}

// Apenas para carregar o input sozinho para facilitar o teste
// document.addEventListener('DOMContentLoaded', () => {
//   const xhr = new XMLHttpRequest();
//   xhr.open('GET', 'teste.txt', true);
//   xhr.onreadystatechange = function() {
//     if (xhr.readyState === XMLHttpRequest.DONE) {
//       if (xhr.status === 200) {
//         txtInput.value = xhr.responseText;
//         btnProcessar.click();
//       } else {
//         console.error('Erro ao carregar o arquivo');
//       }
//     }
//   };
//   xhr.send();
// });

// Aqui a brincadeira começa
btnProcessar.addEventListener('click', () => {
  let output = "";

  const texto = txtInput.value;
  const grupos = isolarGrupos(texto);
  const dezenas = somarDezenas(isolarDezenas(texto));
  
  output += `GRUPOS\n`;

  // Calcula o padding do Grupo
  let paddingGrupo = 0;
  grupos.forEach((grupo) => {
    const nomeGrupo = buscarNomeGrupo(grupo);
    paddingGrupo = buscarMaiorComprimento(paddingGrupo, nomeGrupo);
  });

  let totalizadorGeralGrupos = 0;
  grupos.forEach((grupo) => {
    const nomeGrupo = buscarNomeGrupo(grupo);
    const totalizadorGrupo = somarGrupo(grupo);
    
    totalizadorGeralGrupos += totalizadorGrupo;
    output += `Grupo: ${nomeGrupo.padEnd(paddingGrupo, " ")} - Soma: ${totalizadorGrupo}\n`;
  });
  output += `\nTotalizador Geral Grupos: ${converterNumeroParaReal(totalizadorGeralGrupos)}\n\n`;
  
  output += `DEZENAS\n`;

  let totalizadorGeralDezenas = 0;
  dezenas.forEach((dezena) => {
    totalizadorGeralDezenas += dezena.total
    output += `Valor: ${converterNumeroParaReal(dezena.valor)} - Qtd: ${dezena.quantidade} - Total: ${converterNumeroParaReal(dezena.total)}\n`;
  });
  output += `\nTotalizador Geral Dezenas: ${converterNumeroParaReal(totalizadorGeralDezenas)}`;

  output += `\nTotalizador : ${converterNumeroParaReal(totalizadorGeralDezenas+totalizadorGeralGrupos)}`;

  output += `\nComissão : ${converterNumeroParaReal((totalizadorGeralDezenas+totalizadorGeralGrupos)*0.15)}`;

  txtOutput.value = output;
})


function isolarGrupos(texto) {
  // const regex = /💰(.*?)(?=\n💰|$)/gs;
  const regex = /💰(.*?)(?=\n💰|\n\nDEZENAS|\n\n*DEZENAS*|\n\n*DEZENAS :*|$)/gis;
  let matches = [];
  let match;
  while ((match = regex.exec(texto)) !== null) {
    matches.push(match[1].trim());
  }
  
  return matches;
}

function buscarNomeGrupo(grupo) {
  // const regex = /\bG ?\d.*?(?=\n|$)/;
  const regex = /\bG ?\d.*?(?=\n|$)/i;
  const match = grupo.match(regex);

  if (match) {
    return match[0].trim();
  }
  
  return "";
}

function somarGrupo(grupo) {
  // const regex = /^[A-Za-z].*?(\d+).*$/gm;
  const regex = /^(?!💰).*?(\d+).*$/gm;
  const matches = grupo.match(regex);
  
  matches.shift(); // Remove o primeiro item porque é o nome do grupo

  let resultado = 0;
  if (matches) {
    matches.forEach(match => {
      const numeros = match.match(/\d+/);
      if (numeros) {
        resultado += Number(numeros[0]);
      }
    });
  }
  
  return resultado;
}

function isolarDezenas(texto) {
  const regex = /DEZENAS :([\s\S]*)$/i;
  const match = texto.match(regex);

  if (match) {
    return removerLinhasEmBranco(sanitinarValores(match[1].trim()));
  }
  
  return "";
}

function sanitinarValores(texto) {
  const regex = new RegExp(`(${Object.keys(emojiParaTexto).join('|')})`, 'gu');
  return texto.replace(regex, substituirEmoji);
}

function substituirEmoji(emoji) {
  return emojiParaTexto[emoji];
}

function removerLinhasEmBranco(texto) {
  const regex = /\s*$/gm;
  return texto.replace(regex, '');
}

function somarDezenas(dezenas) {
  const regex = /(\d+)➡️(.*?$)/gm;

  const dezenasValores = [];

  let match
  while ((match = regex.exec(dezenas)) !== null) {
    const regexDezenas = /\d\d/g;
    const quantidadeMatch = match[2].match(regexDezenas);
    
    const valor = Number(match[1]);
    const quantidade = quantidadeMatch ? quantidadeMatch.length : 0;

    dezenasValores.push({
      valor,
      quantidade,
      total: valor * quantidade
    })
  }

  return dezenasValores
}

function converterNumeroParaReal(numero) {
  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

function buscarMaiorComprimento(tamanho, texto) {
  if (tamanho < texto.length) {
    return texto.length;
  }

  return tamanho;
}