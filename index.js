var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var imageData1;
var imageData2;
var result;

// cria Canvas e pega os elementos para montar o preview

document.getElementById('arquivo1').onchange = function (evt) {
    var tgt = evt.target || window.event.srcElement,
        files = tgt.files;
    if (FileReader && files && files.length) {
        var fr = new FileReader();
        fr.onload = () => showImage1(fr);
        fr.readAsDataURL(files[0]);
    }
}

document.getElementById('arquivo2').onchange = function (evt) {
    var tgt = evt.target || window.event.srcElement,
        files = tgt.files;
    if (FileReader && files && files.length) {
        var fr = new FileReader();
        fr.onload = () => showImage2(fr);
        fr.readAsDataURL(files[0]);
    }
}

function showImage1(fileReader) {
    var img = document.getElementById("myImage1");
    img.src = fileReader.result;
}

function showImage2(fileReader) {
    var img = document.getElementById("myImage2");
    img.src = fileReader.result;
}

// CREATE PREVIEW - ACIMA

// Ajustar casos de overflow > 255
const adjustOverFlow = img => img.map(pixel => pixel > 255? pixel % 255: pixel);


// mostrar imagem resultante
function showImageResult(img) {
    const wrapper = document.createElement('div');
    const label = document.createElement('p');

    wrapper.appendChild(label);
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    const typedArray = new Uint8ClampedArray(img.length);

    for (let i = 0; i < img.length - 4; i+= 4) {
      typedArray[i] = img[i];
      typedArray[i+ 1] = img[i + 1];
      typedArray[i + 2] = img[i + 2];
      typedArray[i+ 3] = 255;
    }

    const imgData = new ImageData(typedArray, 512, 512);
    context.putImageData(imgData, 0, 0);

    wrapper.appendChild(canvas);
    document.getElementById('canvas-wrapper').appendChild(wrapper);
}


// ajustar casos de pixel menor que 0 - underflow
const adjustUnderFlow = img => img.map(pixel => pixel < 0? 0: pixel);

// inicialização de operações
var add = false;
var subt = false;
var mult = false;
var div = false;
var media = false;
var blend = false;
var andd = false;
var orr = false;
var xorr = false;
var nott1 = false;
var nott2 = false;
var calcHistImg1 = false;
var calcHistImg2 = false;

// operação que vem do front, variaveis criadas acima
function operation(op) {
    op == 'add' ? add = true : add = false;
    op == 'subt' ? subt = true : subt = false;
    op == 'mult' ? mult = true : mult = false;
    op == 'div' ? div = true : div = false;
    op == 'media' ? media = true : media = false;
    op == 'blend' ? blend = true : blend = false;
    op == 'and' ? andd = true : andd = false;
    op == 'or' ? orr = true : orr = false;
    op == 'xor' ? xorr = true : xorr = false;
    op == 'not1' ? nott1 = true : nott1 = false;
    op == 'not2' ? nott2 = true : nott2 = false;
    op == 'calcHistImg1' ? calcHistImg1 = true : calcHistImg1 = false;
    op == 'calcHistImg2' ? calcHistImg2 = true : calcHistImg2 = false;
}

// enviar imagem para calcular resultado
async function sendImage() {
    const [archive1, archive2] = await Promise.all([
      getImageData('arquivo1', 'myImage1'),
      getImageData('arquivo2', 'myImage2')
    ]);

    // se for multiplicação, chama a função referente, assim com os demais
    if (mult) {
        const multiplicationResult = multiply(archive1, archive2);
        showImageResult(multiplicationResult);
    }

    if (div) {
        const divisionResult = divide(archive1,archive2);
        showImageResult(divisionResult);
    }

    if (add) {
        const somaResult = sum(archive1,archive2);
        showImageResult(somaResult);
    }

    if (subt) {
        const subtractionResult = subtract(archive1,archive2);
        showImageResult(subtractionResult);
    }

    if (media) {
        const mediaResult = mediaa(archive1,archive2);
        showImageResult(mediaResult);
    }

    if (blend) {
        const mediaResult = blending(archive1,archive2);
        showImageResult(mediaResult);
    }

    if (orr) {
        const resultOR = or(archive1,archive2);
        showImageResult(resultOR);
    }

    if (andd) {
        const resultAND = and(archive1,archive2);
        showImageResult(resultAND);
    }

    if (xorr) {
        const resultXOR = xor(archive1,archive2);
        showImageResult(resultXOR);
    }

    if (nott1) {
        const resultNOT = not(archive1,archive2);
        showImageResult(resultNOT);
    } 
    
    if (nott2) {
        const resultNOT = not2(archive1,archive2);
        showImageResult(resultNOT);
    }

    if (calcHistImg1) {
        calculateHistImg1(archive1,archive2);
        // const resultHist1 = calculateHistImg1(archive1,archive2);
        // showImageResult(resultHist1);
    }

    if (calcHistImg2) {
        calculateHistImg2(archive1,archive2);
        // const resultHist1 = calculateHistImg1(archive1,archive2);
        // showImageResult(resultHist1);
    }
}

function getImageData(inputId, imgId) {
    return new Promise((resolve, reject) => {
      const input = document.getElementById(inputId);
      const img = document.getElementById(imgId)

      img.src = URL.createObjectURL(input.files[0]);
      console.log(input.files[0])
      const imgObj = new Image();

      setTimeout(() => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);
        const data = context.getImageData(0, 0, 512, 512)

        return resolve(data.data);
      }, 200);
    });
}

// realiza a multiplicação
function multiply(firstMatriz, secondMatriz) {
    const result = [];
    for (let i = 0; i < firstMatriz.length; i++) {
      result[i] = firstMatriz[i] * secondMatriz[i];
    }

    var num = $("#mult").val();
    for (let j = 0; j < result.length; j++) {
        result[j] = result[j] * parseFloat(num);
    }

    return adjustOverFlow(result);
}

// realiza o blend
function blending(firstMatriz, secondMatriz) {
    const result = [];
    var num = $("#blend").val();
    for (let i = 0; i < firstMatriz.length; i++) {
      result[i] = parseFloat(num) * firstMatriz[i] + (1 - parseFloat(num)) * secondMatriz[i];
    }

    return adjustOverFlow(result);
}


// realiza a soma
function sum(firstMatriz, secondMatriz) {
    const result = [];
    for (let i = 0; i < firstMatriz.length; i++) {
      result[i] = firstMatriz[i] + secondMatriz[i];
    }

    return adjustOverFlow(result);
}


// realiza a subtração
function subtract(firstMatriz, secondMatriz) {
    const result = [];
    for (let i = 0; i < firstMatriz.length; i++) {
      result[i] = firstMatriz[i] - secondMatriz[i];
    }

    return adjustUnderFlow(result);
}


// realiza a divisão
function divide(firstMatriz, secondMatriz) {
    const result = [];
    for (let i = 0; i < firstMatriz.length; i++) {
      result[i] = firstMatriz[i] / secondMatriz[i];
    }

    var num = $("#div").val();

    for (let j = 0; j < result.length; j++) {
        result[j] = result[j] * parseFloat(num);
    }

    return adjustUnderFlow(result);
}


// realiza a média
function mediaa(firstMatriz, secondMatriz) {
    const result = [];
    for (let i = 0; i < firstMatriz.length; i++) {
      result[i] = (firstMatriz[i] + secondMatriz[i]) / 2;
    }

    return adjustOverFlow(result);
}

// realiza o OR
function or(firstMatriz, secondMatriz) {
    const result = [];
    for (let i = 0; i < firstMatriz.length; i++) {
        result[i] = (firstMatriz[i] | secondMatriz[i]);
    }

    return adjustOverFlow(result);
}

// realiza o AND
function and(firstMatriz, secondMatriz) {
    const result = [];
    for (let i = 0; i < firstMatriz.length; i++) {
        result[i] = (firstMatriz[i] & secondMatriz[i]);
    }

    return adjustOverFlow(result);
}

// realiza o XOR
function xor(firstMatriz, secondMatriz) {
    const result = [];
    for (let i = 0; i < firstMatriz.length; i++) {
        result[i] = (firstMatriz[i] ^ secondMatriz[i]);
    }

    return adjustOverFlow(result);
}

// realiza o NOT 1
function not(firstMatriz, secondMatriz) {
    const result = [];
    for (let i = 0; i < firstMatriz.length; i++) {
      result[i] = firstMatriz[i] != secondMatriz[i];
      result[i] = 255 - firstMatriz[i];
    }

    return adjustOverFlow(result);
}

// realiza o NOT 2
function not2(firstMatriz, secondMatriz) {
    const result = [];
    for (let i = 0; i < firstMatriz.length; i++) {
      result[i] = firstMatriz[i] != secondMatriz[i];
      result[i] = 255 - secondMatriz[i];
    }

    return adjustOverFlow(result);
}

// calcular histograma da imagem 1
function calculateHistImg1(firstMatriz, secondMatriz) {
    // var pixels = [...Array(255)].map(()=> 0 );
    
    // console.log(firstMatriz.length);
    
    // Cria um array de contagem
    const result1 = [];
    // const array_contador = [];
    var value = 0;

    // Array para armazenar as labels do gráfico
    const labels1 = [];

    // adiciona 256 elementos ao array, todos valendo o número 0
    for (let i = 0; i < 256; i++) {
        result1.push(0);
        labels1.push(i.toString());
    }

    //Percorre cada pixel da imagem. Pula de 4 em 4, pois percorre o RGBA
    for (let j = 0; j < firstMatriz.length; j += 4) {
        // Como a imagem é em escala de cinza, os valores de R, G e B são os mesmos
        value = firstMatriz[j];

        // Aumenta o contador de números repetidos nesse índice
        result1[value]++;
    }
    
    console.log(result1);

    makeGraphic1(result1, labels1);
}

function makeGraphic1(result, labels) {
    console.log(labels);
    console.log(result);

    const config = {
        type: 'bar',
        data: data = {
            labels: labels,
            datasets: [{
              label: 'Quantidade de pixeis',
              data: result,
              backgroundColor: [
                'rgb(156, 70, 71)',
              ],
              borderColor: [
                'rgb(156, 70, 71)',
              ],
              borderWidth: 1
            }]
          },
        options: {
          scales: {
            y: {
              beginAtZero: false
            }
          }
        },
      };
    image1 = new Chart(
        document.getElementById('grafico-histograma1'),
        config
    );
    $(".title-hist1").text('Histograma Imagem 1')
}

// calcular histograma da imagem 2
// function calculateHistImg2(firstMatriz, secondMatriz) {
//     // var pixels = [...Array(255)].map(()=> 0 );
    
//     // console.log(firstMatriz.length);
    
//     // Cria um array de contagem
//     const result2 = [];
//     // const array_contador = [];
//     var value = 0;

//     // Array para armazenar as labels do gráfico
//     const labels2 = [];

//     // adiciona 256 elementos ao array, todos valendo o número 0
//     for (let i = 0; i < 256; i++) {
//         result2.push(0);
//         labels2.push(i.toString());
//     }

//     //Percorre cada pixel da imagem. Pula de 4 em 4, pois percorre o RGBA
//     for (let j = 0; j < firstMatriz.length; j += 4) {
//         // Como a imagem é em escala de cinza, os valores de R, G e B são os mesmos
//         value = firstMatriz[j];

//         // Aumenta o contador de números repetidos nesse índice
//         result2[value]++;
//     }
    
//     console.log(result2);

//     makeGraphic2(result2, labels2);
// }

// function makeGraphic2(result, labels) {
//     console.log(labels);
//     console.log(result);

//     const config = {
//         type: 'bar',
//         data: data = {
//             labels: labels,
//             datasets: [{
//               label: 'Quantidade de pixeis',
//               data: result,
//               backgroundColor: [
//                 'rgb(156, 70, 71)',
//               ],
//               borderColor: [
//                 'rgb(156, 70, 71)',
//               ],
//               borderWidth: 1
//             }]
//           },
//         options: {
//           scales: {
//             y: {
//               beginAtZero: false
//             }
//           }
//         },
//       };
//     image2 = new Chart(
//         document.getElementById('grafico-histograma2'),
//         config
//     );
//     $(".title-hist2").text('Histograma Imagem 2');
// }