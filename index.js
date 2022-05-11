var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var imageData1;
var imageData2;
var result;

document.getElementById('file1').onchange = function (evt) {
    var tgt = evt.target || window.event.srcElement,
        files = tgt.files;
    if (FileReader && files && files.length) {
        var fr = new FileReader();
        fr.onload = () => showImage1(fr);
        fr.readAsDataURL(files[0]);
    }
}

document.getElementById('file2').onchange = function (evt) {
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

//////////////////////////////////////////////////

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

const resolveOverflow = img => img.map(pixel => pixel > 255? pixel % 255: pixel);
const resolveUnderflow = img => img.map(pixel => pixel < 0? 0: pixel);

function draw(img, labelText) {
    const wrapper = document.createElement('div');
    const label = document.createElement('p');
    label.innerText = labelText;

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

async function submit() {
    const [data1, data2] = await Promise.all([
      getImageData('file1', 'myImage1'),
      getImageData('file2', 'myImage2')
    ]);

    if (mult) {
        const multiplyResult = multiply(data1, data2);
        draw(multiplyResult, 'MULTIPLICAÇÃO');
    }

    if (div) {
        const divideResult = divide(data1,data2);
        draw(divideResult, 'DIVISÃO');
    }

    if (add) {
        const sumResult = sum(data1,data2);
        draw(sumResult, 'ADIÇÃO');
    }

    if (subt) {
        const subtractResult = subtract(data1,data2);
        draw(subtractResult, 'SUBTRAÇÃO');
    }

    if (media) {
        const averageResult = average(data1,data2);
        draw(averageResult, 'MÉDIA');
    }

    if (blend) {
        const averageResult = blending(data1,data2);
        draw(averageResult, 'BLEND');
    }

    if (orr) {
        const orResult = or(data1,data2);
        draw(orResult, 'OR');
    }

    if (andd) {
        const andResult = and(data1,data2);
        draw(andResult, 'AND');
    }

    if (xorr) {
        const xorResult = xor(data1,data2);
        draw(xorResult, 'XOR');
    }

    if (nott) {
        const notResult = not(data1,data2);
        draw(notResult, 'NOT');
    }
}

function multiply(matrix1, matrix2) {
    const result = [];
    for (let i = 0; i < matrix1.length; i++) {
      result[i] = matrix1[i] * matrix2[i];
    }

    var num = $("#mult").val();
    for (let j = 0; j < result.length; j++) {
        result[j] = result[j] * parseFloat(num);
    }

    return resolveOverflow(result);
}

function blending(matrix1, matrix2) {
    const result = [];
    var num = $("#blend").val();
    for (let i = 0; i < matrix1.length; i++) {
      result[i] = parseFloat(num) * matrix1[i] + (1 - parseFloat(num)) * matrix2[i];
    }

    // for (let j = 0; j < result.length; j++) {
    //     result[j] = result[j] * parseFloat(num);
    // }

    return resolveOverflow(result);
}

function sum(matrix1, matrix2) {
    const result = [];
    for (let i = 0; i < matrix1.length; i++) {
      result[i] = matrix1[i] + matrix2[i];
    }

    return resolveOverflow(result);
}

function subtract(matrix1, matrix2) {
    const result = [];
    for (let i = 0; i < matrix1.length; i++) {
      result[i] = matrix1[i] - matrix2[i];
    }

    return resolveUnderflow(result);
}

function divide(matrix1, matrix2) {
    const result = [];
    for (let i = 0; i < matrix1.length; i++) {
      result[i] = matrix1[i] / matrix2[i];
    }

    var num = $("#div").val();
    for (let j = 0; j < result.length; j++) {
        result[j] = result[j] * parseFloat(num);
    }

    return resolveUnderflow(result);
}

function average(matrix1, matrix2) {
    const result = [];
    for (let i = 0; i < matrix1.length; i++) {
      result[i] = (matrix1[i] + matrix2[i]) / 2;
    }

    return resolveOverflow(result);
}

function or(matrix1, matrix2) {
    const result = [];
    for (let i = 0; i < matrix1.length; i++) {
        result[i] = (matrix1[i] | matrix2[i]);
    }

    return resolveOverflow(result);
}

function and(matrix1, matrix2) {
    const result = [];
    for (let i = 0; i < matrix1.length; i++) {
        result[i] = (matrix1[i] & matrix2[i]);
    }

    return resolveOverflow(result);
}

function xor(matrix1, matrix2) {
    const result = [];
    for (let i = 0; i < matrix1.length; i++) {
        result[i] = (matrix1[i] ^ matrix2[i]);
    }

    return resolveOverflow(result);
}

function not(matrix1, matrix2) {
    const result = [];
    for (let i = 0; i < matrix1.length; i++) {
      result[i] = matrix1[i] != matrix2[i];
    }

    return resolveOverflow(result);
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