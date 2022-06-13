var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var imageData1;
var imageData2;
var result;

// cria Canvas e pega os elementos para montar o preview IMG 1
document.getElementById('arquivo1').onchange = function (evt) {
    var tgt = evt.target || window.event.srcElement,
        files = tgt.files;
    if (FileReader && files && files.length) {
        var fr = new FileReader();
        fr.onload = () => showImage1(fr);
        fr.readAsDataURL(files[0]);
    }
}

// cria Canvas e pega os elementos para montar o preview IMG 2
document.getElementById('arquivo2').onchange = function (evt) {
    var tgt = evt.target || window.event.srcElement,
        files = tgt.files;
    if (FileReader && files && files.length) {
        var fr = new FileReader();
        fr.onload = () => showImage2(fr);
        fr.readAsDataURL(files[0]);
    }
}

// exbibe imagem 1
function showImage1(fileReader) {
    var img = document.getElementById("myImage1");
    img.src = fileReader.result;
}

// exbibe imagem 1
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
var calcHistImg1Gray = false;
var calcHistImg1RGB = false;
var realImg1Min = false;
var realImg1Max = false;
var realImg1Media = false;

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
    op == 'calcHistImg1Gray' ? calcHistImg1Gray = true : calcHistImg1Gray = false;
    op == 'calcHistImg1RGB' ? calcHistImg1RGB = true : calcHistImg1RGB = false;
    op == 'realImg1Min' ? realImg1Min = true : realImg1Min = false;
    op == 'realImg1Max' ? realImg1Max = true : realImg1Max = false;
    op == 'realImg1Media' ? realImg1Media = true : realImg1Media = false;
}

// enviar imagem para calcular resultado
async function sendImage() {
    const [archive1, archive2] = await Promise.all([
      getImageData('arquivo1', 'myImage1'),
      getImageData('arquivo2', 'myImage2')
    ]);

    // se for multiplicação, chama a função
    if (mult) {
        const multiplicationResult = multiply(archive1, archive2);
        showImageResult(multiplicationResult);
    }

    // se for divisao, chama a função
    if (div) {
        const divisionResult = divide(archive1,archive2);
        showImageResult(divisionResult);
    }

    // se for adicao, chama a função
    if (add) {
        const somaResult = sum(archive1,archive2);
        showImageResult(somaResult);
    }

    // se for subtracao, chama a função
    if (subt) {
        const subtractionResult = subtract(archive1,archive2);
        showImageResult(subtractionResult);
    }

    // se for media, chama a função
    if (media) {
        const mediaResult = mediaa(archive1,archive2);
        showImageResult(mediaResult);
    }

    // se for blend, chama a função
    if (blend) {
        const mediaResult = blending(archive1,archive2);
        showImageResult(mediaResult);
    }

    // se for OR, chama a função
    if (orr) {
        const resultOR = or(archive1,archive2);
        showImageResult(resultOR);
    }

    // se for AND, chama a função
    if (andd) {
        const resultAND = and(archive1,archive2);
        showImageResult(resultAND);
    }

    // se for XOR, chama a função
    if (xorr) {
        const resultXOR = xor(archive1,archive2);
        showImageResult(resultXOR);
    }

    // se for NOT img 1, chama a função
    if (nott1) {
        const resultNOT = not(archive1,archive2);
        showImageResult(resultNOT);
    } 

    // se for NOT img 2, chama a função
    if (nott2) {
        const resultNOT = not2(archive1,archive2);
        showImageResult(resultNOT);
    }

    // se for histograma escala de cinza
    if (calcHistImg1Gray) {
        const resultHist1 = calculateHistImg1Gray(archive1,archive2);
        showImageResult(resultHist1);
    }

    // se for histograma EGB
    if (calcHistImg1RGB) {
        const resultHistRGB = calculateHistImg1RGB(archive1,archive2);
        showImageResult(resultHistRGB);
    }

    // se for realce MIN
    if (realImg1Min) {
        const realceImg = realceImg1(archive1,archive2, 'min');
        showImageResult(realceImg);
    }

    // se for realce MAX
    if (realImg1Max) {
        const realceImg = realceImg1(archive1,archive2, 'max');
        showImageResult(realceImg);
    }

    // se for realce MEDIA
    if (realImg1Media) {
        const realceImg = realceImg1(archive1,archive2, 'media');
        showImageResult(realceImg);
    }
}

// Cria array das imagens selecionadas
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

// realiza o NOT Img 1
function not(firstMatriz, secondMatriz) {
    const result = [];
    for (let i = 0; i < firstMatriz.length; i++) {
      result[i] = firstMatriz[i] != secondMatriz[i];
      result[i] = 255 - firstMatriz[i];
    }

    return adjustOverFlow(result);
}

// realiza o NOT Img 2
function not2(firstMatriz, secondMatriz) {
    const result = [];
    for (let i = 0; i < firstMatriz.length; i++) {
      result[i] = firstMatriz[i] != secondMatriz[i];
      result[i] = 255 - secondMatriz[i];
    }

    return adjustOverFlow(result);
}

// calcular histograma da imagem 1 - RGB
function calculateHistImg1RGB(firstMatriz, secondMatriz) {
    const resultR = [];
    const resultG = [];
    const resultB = [];

    var valueR = 0;
    var valueG = 0;
    var valueB = 0;

    const textsImageR = [];
    const textsImageG = [];
    const textsImageB = [];

    for (let i = 0; i < 256; i++) {
        resultR.push(0);
        textsImageR.push(i.toString());
    }

    for (let i = 0; i < 256; i++) {
        resultG.push(0);
        textsImageG.push(i.toString());
    }

    for (let i = 0; i < 256; i++) {
        resultB.push(0);
        textsImageB.push(i.toString());
    }

    for (let j = 0; j < firstMatriz.length; j += 4) {
        // Como a imagem é em escala de cinza, os valores de R, G e B são os mesmos
        valueR = firstMatriz[j];
        resultR[valueR]++;
    }

    for (let j = 1; j < firstMatriz.length; j += 4) {
        // Como a imagem é em escala de cinza, os valores de R, G e B são os mesmos
        valueG = firstMatriz[j];
        resultG[valueG]++;
    }

    for (let j = 2; j < firstMatriz.length; j += 4) {
        // Como a imagem é em escala de cinza, os valores de R, G e B são os mesmos
        valueB = firstMatriz[j];
        resultB[valueB]++;
    }

    // Monta gráfico da imagem RGB
    makeGraphic1RGB(resultR, textsImageR, resultG, textsImageG, resultB, textsImageB);

    // Equaliza a imagem RGB
    const resultEqualizationRGB = equalization1RGB(firstMatriz, resultR, resultG, resultB);
    return resultEqualizationRGB;
}

// calcular histograma da imagem 1 - Escala de cinza
function calculateHistImg1Gray(firstMatriz, secondMatriz) {
    const result1 = [];
    var value = 0;
    const textsImage1 = [];

    for (let i = 0; i < 256; i++) {
        result1.push(0);
        textsImage1.push(i.toString());
    }

    for (let j = 0; j < firstMatriz.length; j += 4) {
        // Como a imagem é em escala de cinza, os valores de R, G e B são os mesmos
        value = firstMatriz[j];
        result1[value]++;
    }
    
    console.log(result1);

    // Monta gráfico da imagem em escala de cinza
    makeGraphic1EscalaCinza(result1, textsImage1);

    // Equaliza a imagem escala de cinza
    const resultEqualization = equalization1EscalaCinza(firstMatriz, result1);
    return resultEqualization;
}

// Equaliza a imagem RGB
function equalization1RGB(firstMatriz, resultR, resultG, resultB) {
    // R
    let CFDR = [];
    let array_contadorR = resultR;
    CFDR[0] = array_contadorR[0];

    for (let i = 1; i < 256; i++) {
        CFDR.push(CFDR[i - 1] + array_contadorR[i]);
    }
  
    Array.min = function(array) {
        return Math.min.apply(Math, array);
    };
    let hr = [];
   
    for (let i = 0; i < CFDR.length; i++) {
        let ar = CFDR[i] - Array.min(CFDR);
        let br = (firstMatriz.length / 4) - Array.min(CFDR);
        let cr = 256 - 1;

        hr.push(Math.floor(ar / br * cr))
    }
 
    for (let i = 0; i < firstMatriz.length; i += 4) {
        firstMatriz[i] = hr[firstMatriz[i]];
        firstMatriz[i + 1] = firstMatriz[i];
        firstMatriz[i + 2] = firstMatriz[i];
    }

    //G
    let CFDG = [];
    let array_contadorG = resultG;
    CFDG[0] = array_contadorG[0];

    for (let i = 1; i < 256; i++) {
        CFDG.push(CFDG[i - 1] + array_contadorG[i]);
    }
  
    Array.min = function(array) {
        return Math.min.apply(Math, array);
    };
    let hg = [];
   
    for (let i = 1; i < CFDG.length; i++) {
        let ag = CFDG[i] - Array.min(CFDG);
        let bg = (firstMatriz.length / 4) - Array.min(CFDG);
        let cg = 256 - 1;

        hg.push(Math.floor(ag / bg * cg))
    }
 
    for (let i = 1; i < firstMatriz.length; i += 4) {
        firstMatriz[i] = hg[firstMatriz[i]];
        firstMatriz[i + 1] = firstMatriz[i];
        firstMatriz[i + 2] = firstMatriz[i];
    }

    //B
    let CFDB = [];
    let array_contadorB = resultB;
    CFDB[0] = array_contadorB[0];

    for (let i = 1; i < 256; i++) {
        CFDB.push(CFDB[i - 1] + array_contadorB[i]);
    }
  
    Array.min = function(array) {
        return Math.min.apply(Math, array);
    };
    let hb = [];
   
    for (let i = 2; i < CFDB.length; i++) {
        let ab = CFDB[i] - Array.min(CFDB);
        let bb = (firstMatriz.length / 4) - Array.min(CFDB);
        let cb = 256 - 1;

        hb.push(Math.floor(ab / bb * cb))
    }
 
    for (let i = 2; i < firstMatriz.length; i += 4) {
        firstMatriz[i] = hb[firstMatriz[i]];
        firstMatriz[i + 1] = firstMatriz[i];
        firstMatriz[i + 2] = firstMatriz[i];
    }
    
    // makeGraphic1EscalaCinzaEqualizated(firstMatriz)
    return firstMatriz;
}

// Equaliza a imagem escala de cinza
function equalization1EscalaCinza(firstMatriz, result1) {
    //Calculando o CFD da imagem
    let CFD = [];

    let array_contador = result1;

    CFD[0] = array_contador[0];

    for (let i = 1; i < 256; i++) {
        CFD.push(CFD[i - 1] + array_contador[i]);
    }

    // Função para retornar o menor valor de um array
    Array.min = function(array) {
        return Math.min.apply(Math, array);
    };

    let h = [];

    //Percorre cada índice do CFD para montar o h
    for (let i = 0; i < CFD.length; i++) {
        let a = CFD[i] - Array.min(CFD);
        let b = (firstMatriz.length / 4) - Array.min(CFD);
        let c = 256 - 1;

        h.push(Math.floor(a / b * c))
    }

    //Percorre cada pixel da imagem. Pula de 4 em 4, pois percorre o RGBA
    for (let i = 0; i < firstMatriz.length; i += 4) {
        firstMatriz[i] = h[firstMatriz[i]];

        firstMatriz[i + 1] = firstMatriz[i];
        firstMatriz[i + 2] = firstMatriz[i];
    }

    // Cria gráfico da imagem escala de cinza equalizada
    makeGraphic1EscalaCinzaEqualizated(firstMatriz)

    return firstMatriz;
}

// Cria gráfico  da imagem escala de cinza equalizada
function makeGraphic1EscalaCinzaEqualizated(firstMatriz) {
    const result1 = [];
    var value = 0;
    const textsImage1 = [];

    // adiciona 256 elementos ao array, todos valendo o número 0
    for (let i = 0; i < 256; i++) {
        result1.push(0);
        textsImage1.push(i.toString());
    }

    //Percorre cada pixel da imagem. Pula de 4 em 4, pois percorre o RGBA
    for (let j = 0; j < firstMatriz.length; j += 4) {
        // Como a imagem é em escala de cinza, os valores de R, G e B são os mesmos
        value = firstMatriz[j];

        // Aumenta o contador de números repetidos nesse índice
        result1[value]++;
    }

    const config = {
        type: 'bar',
        data: data = {
            labels: textsImage1,
            datasets: [{
              label: 'Quantidade de pixeis',
              data: result1,
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
        document.getElementById('grafico-histogramaEq'),
        config
    );
    $(".title-hist1Eq").text('Histograma Imagem 1 - Escala de Cinza Equalizado');
}

// Monta gráfico da imagem em escala de cinza
function makeGraphic1EscalaCinza(result, labels) {
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
    $(".title-hist1").text('Histograma Imagem 1 - Escala de Cinza');
}

// Monta gráfico RGB
function makeGraphic1RGB(resultR, textsImageR, resultG, textsImageG, resultB, textsImageB) {
    // R
    const configR = {
        type: 'bar',
        data: data = {
            labels: textsImageR,
            datasets: [{
              label: 'Quantidade de pixeis',
              data: resultR,
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
        document.getElementById('grafico-histogramaR'),
        configR
    );
    $(".title-hist1R").text('Histograma Imagem 1 - R');

    // G
    const configG = {
        type: 'bar',
        data: data = {
            labels: textsImageG,
            datasets: [{
              label: 'Quantidade de pixeis',
              data: resultG,
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
        document.getElementById('grafico-histogramaG'),
        configG
    );
    $(".title-hist1G").text('Histograma Imagem 1 - G');

    // B
    const configB = {
        type: 'bar',
        data: data = {
            labels: textsImageB,
            datasets: [{
              label: 'Quantidade de pixeis',
              data: resultB,
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
        document.getElementById('grafico-histogramaB'),
        configB
    );
    $(".title-hist1B").text('Histograma Imagem 1 - B');
}


// Realiza realce da imagem 1 - RGB e Escala de cinza
function realceImg1(firstMatriz, secondMatriz, realceOperation) {
    console.log(firstMatriz.length);

    var pixels = firstMatriz.length / 4;
    var coluna = Math.sqrt(pixels, 2) * 4;
    var qtdLinhas = Math.sqrt(pixels, 2);

    // Cria 2 arrays para servir de coluna e linha -> push do menor(Linhas) no maior(Colunas)
    var arrayFora = [];
    var linhas = [];

    for (let i = 0; i < firstMatriz.length; i++) {
        linhas.push(firstMatriz[i]);
        if(linhas.length == coluna) {
            arrayFora.push(linhas);
            linhas = [];
        }
    }

    // R G B A R G B A R G B
    // 0 1 2 3 4 5 6 7 8 9 10
    var k = coluna + 4;

    // R
    for(let x = 1; x < qtdLinhas - 1; x++) {
        for(let y = 4; y < arrayFora[0].length - 4; y += 4) {
            // x sempre + 1 e - 1 e y sempre + 4 e - 4
            let noroeste_x = x - 1;
            let noroeste_y = y - 4;

            let norte_x = x;
            let norte_y = y - 4;

            let nordeste_x = x + 1;
            let nordeste_y = y - 4;

            let oeste_x = x - 1;
            let oeste_y = y;

            let sudoeste_x = x - 1;
            let sudoeste_y = y + 4;

            let sul_x = x;
            let sul_y = y + 4;

            let sudeste_x = x + 1;
            let sudeste_y = y + 4;

            let leste_x = x + 1;
            let leste_y = y;

            // Pega coordenadas dos pontos ao redor do pixel alvo
            var noroeste = arrayFora[noroeste_x][noroeste_y];
            var norte = arrayFora[norte_x][norte_y];
            var nordeste = arrayFora[nordeste_x][nordeste_y];
            var oeste = arrayFora[oeste_x][oeste_y];
            var sudoeste = arrayFora[sudoeste_x][sudoeste_y];
            var sul = arrayFora[sul_x][sul_y];
            var sudeste = arrayFora[sudeste_x][sudeste_y];
            var leste = arrayFora[leste_x][leste_y];
            var centro = arrayFora[x][y];

            // A FAZER - CRIAR ARRAY DE 9 POSIÇÕES COM OS VALORES A SEREM MULTIPLICADOS NO ARRAY 'coordenadas'
            var coordenadas = [noroeste * 1, norte * 1, nordeste * 1, oeste * 1, sudoeste * 1, sul * 1, sudeste * 1, leste * 1, centro * 1];

            // Se for 'MIN', realiza o mínimo
            if (realceOperation == 'min') {
                var convolucao = Math.min(...coordenadas);
            }

            // Se for 'MAX', realiza o máximo
            if(realceOperation == 'max') {
                var convolucao = Math.max(...coordenadas);
            }

            // Se for 'Media', realiza a media
            if (realceOperation == 'media') {
                let unitMax = 0;

                for (let index = 0; index < coordenadas.length; index++) {
                    unitMax += coordenadas[index];
                }

                unitMax = unitMax / coordenadas.length;
                var convolucao = unitMax;
            }

            // Preenche a matriz principal com os valores R
            firstMatriz[k] = convolucao;

            // Se estiver na última coluna, igona a última coluna e primeira linha
            if (y == arrayFora[0].length - 8) {
                k  += 12;
            } else {
                k += 4;
            }
        }
    }

    k = coluna + 5;

    // G
    for(let x = 1; x < qtdLinhas - 1; x++) {
        for(let y = 5; y < arrayFora[0].length - 4; y += 4) {
            // x sempre + 1 e - 1 e y sempre + 4 e - 4
            let noroeste_x = x - 1;
            let noroeste_y = y - 4;

            let norte_x = x;
            let norte_y = y - 4;

            let nordeste_x = x + 1;
            let nordeste_y = y - 4;

            let oeste_x = x - 1;
            let oeste_y = y;

            let sudoeste_x = x - 1;
            let sudoeste_y = y + 4;

            let sul_x = x;
            let sul_y = y + 4;

            let sudeste_x = x + 1;
            let sudeste_y = y + 4;

            let leste_x = x + 1;
            let leste_y = y;

            // Pega coordenadas dos pontos ao redor do pixel alvo
            var noroeste = arrayFora[noroeste_x][noroeste_y];
            var norte = arrayFora[norte_x][norte_y];
            var nordeste = arrayFora[nordeste_x][nordeste_y];
            var oeste = arrayFora[oeste_x][oeste_y];
            var sudoeste = arrayFora[sudoeste_x][sudoeste_y];
            var sul = arrayFora[sul_x][sul_y];
            var sudeste = arrayFora[sudeste_x][sudeste_y];
            var leste = arrayFora[leste_x][leste_y];
            var centro = arrayFora[x][y];

            // A FAZER - CRIAR ARRAY DE 9 POSIÇÕES COM OS VALORES A SEREM MULTIPLICADOS NO ARRAY 'coordenadas'
            var coordenadas = [noroeste * 1, norte * 1, nordeste * 1, oeste * 1, sudoeste * 1, sul * 1, sudeste * 1, leste * 1, centro * 1];
            
            if (realceOperation == 'min') {
                var convolucao = Math.min(...coordenadas);
            } 

            if(realceOperation == 'max') {
                var convolucao = Math.max(...coordenadas);
            }
            
            if (realceOperation == 'media') {
                let unitMax = 0;

                for (let index = 0; index < coordenadas.length; index++) {
                    unitMax += coordenadas[index];
                }

                unitMax = unitMax / coordenadas.length;
                var convolucao = unitMax;
            }

            // Preenche a matriz principal com os valores G
            firstMatriz[k] = convolucao;

            // Se estiver na última coluna, igona a última coluna e primeira linha
            if (y == arrayFora[0].length - 7) {
                k  += 12;
            } else {
                k += 4;
            }

        }
    }

    k = coluna + 6

    // B
    for(let x = 1; x < qtdLinhas - 1; x++) {
        for(let y = 6; y < arrayFora[0].length - 4; y += 4) {
            // x sempre + 1 e - 1 e y sempre + 4 e - 4
            let noroeste_x = x - 1;
            let noroeste_y = y - 4;

            let norte_x = x;
            let norte_y = y - 4;

            let nordeste_x = x + 1;
            let nordeste_y = y - 4;

            let oeste_x = x - 1;
            let oeste_y = y;

            let sudoeste_x = x - 1;
            let sudoeste_y = y + 4;

            let sul_x = x;
            let sul_y = y + 4;

            let sudeste_x = x + 1;
            let sudeste_y = y + 4;

            let leste_x = x + 1;
            let leste_y = y;

            // Pega coordenadas dos pontos ao redor do pixel alvo
            var noroeste = arrayFora[noroeste_x][noroeste_y];
            var norte = arrayFora[norte_x][norte_y];
            var nordeste = arrayFora[nordeste_x][nordeste_y];
            var oeste = arrayFora[oeste_x][oeste_y];
            var sudoeste = arrayFora[sudoeste_x][sudoeste_y];
            var sul = arrayFora[sul_x][sul_y];
            var sudeste = arrayFora[sudeste_x][sudeste_y];
            var leste = arrayFora[leste_x][leste_y];
            var centro = arrayFora[x][y];

            // A FAZER - CRIAR ARRAY DE 9 POSIÇÕES COM OS VALORES A SEREM MULTIPLICADOS NO ARRAY 'coordenadas'
            var coordenadas = [noroeste * 1, norte * 1, nordeste * 1, oeste * 1, sudoeste * 1, sul * 1, sudeste * 1, leste * 1, centro * 1];
            
            if (realceOperation == 'min') {
                var convolucao = Math.min(...coordenadas);
            } 
            
            if(realceOperation == 'max') {
                var convolucao = Math.max(...coordenadas);
            }
            
            if (realceOperation == 'media') {
                let unitMax = 0;

                for (let index = 0; index < coordenadas.length; index++) {
                    unitMax += coordenadas[index];
                }

                unitMax = unitMax / coordenadas.length;
                var convolucao = unitMax;
            }

            // Preenche a matriz principal com os valores B
            firstMatriz[k] = convolucao;

            // Se estiver na última coluna, igona a última coluna e primeira linha
            if (y == arrayFora[0].length - 6) {
                k  += 12;
            } else {
                k += 4;
            }
        }
    }

    return firstMatriz
}