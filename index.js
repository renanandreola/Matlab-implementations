var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var imageData1;
var imageData2;
var result;

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

// CREATE PREVIEW

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

var add = false;
var subt = false;
var mult = false;
var div = false;
var media = false;
var blend = false;
var andd = false;
var orr = false;
var xorr = false;
var nott = false;

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
    op == 'not' ? nott = true : nott = false;
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

    if (nott) {
        const resultNOT = not(archive1,archive2);
        showImageResult(resultNOT);
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

    // for (let j = 0; j < result.length; j++) {
    //     result[j] = result[j] * parseFloat(num);
    // }

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

// realiza o NOT
function not(firstMatriz, secondMatriz) {
    const result = [];
    for (let i = 0; i < firstMatriz.length; i++) {
      result[i] = firstMatriz[i] != secondMatriz[i];
    }

    return adjustOverFlow(result);
}