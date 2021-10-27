console.log("hello geysss");

const model = new mi.ArbitraryStyleTransferNetwork();
const canvas = document.getElementById("stylized");
const ctx = canvas.getContext("2d");
const contentImg = document.getElementById("contentImage");
const styleImg = document.getElementById("styleImage");
const loading = document.getElementById("loading");
const notLoading = document.getElementById("ready");
const transferButton = document.getElementById("transferButton");

function readContentURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $("#contentImage").attr("src", e.target.result).width(200).height(250);
    };

    reader.readAsDataURL(input.files[0]);
  }
}

function readStyleURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $("#styleImage").attr("src", e.target.result).width(200).height(250);
    };

    reader.readAsDataURL(input.files[0]);
  }
}

function setupDemo() {
  model.initialize().then(() => {
    stylize();
  });
}

async function clearCanvas() {
  // Don't block painting until we've reset the state.
  await mi.tf.nextFrame();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  await mi.tf.nextFrame();
}

async function stylize() {
  await clearCanvas();

  // Resize the canvas to be the same size as the source image.
  canvas.width = contentImg.width;
  canvas.height = contentImg.height;

  // This does all the work!
  model.stylize(contentImg, styleImg).then((imageData) => {
    stopLoading();
    ctx.putImageData(imageData, 0, 0);
  });
}

function loadImage(event, imgElement) {
  const reader = new FileReader();
  reader.onload = (e) => {
    imgElement.src = e.target.result;
    startLoading();
    stylize();
  };
  reader.readAsDataURL(event.target.files[0]);
}

function loadContent(event) {
  loadImage(event, contentImg);
}

function loadStyle(event) {
  loadImage(event, styleImg);
}

function startLoading() {
  loading.hidden = false;
  notLoading.hidden = true;
  canvas.style.opacity = 0;
}

function stopLoading() {
  loading.hidden = true;
  notLoading.hidden = false;
  canvas.style.opacity = 1;
}

$(transferButton).click(() => {
  setupDemo();
});
