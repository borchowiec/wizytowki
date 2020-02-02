var PIXEL_RATIO = (function () {
  var ctx = document.createElement("canvas").getContext("2d"),
    dpr = window.devicePixelRatio || 1,
    bsr = ctx.webkitBackingStorePixelRatio ||
      ctx.mozBackingStorePixelRatio ||
      ctx.msBackingStorePixelRatio ||
      ctx.oBackingStorePixelRatio ||
      ctx.backingStorePixelRatio || 1;

  return dpr / bsr;
})();


createHiDPICanvas = function(w, h, ratio) {
  if (!ratio) { ratio = PIXEL_RATIO; }
  const can = document.createElement("canvas");
  can.width = w * ratio;
  can.height = h * ratio;
  can.id = "cardCanvas";
  can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
  return can;
};


const canvas = createHiDPICanvas(1500, 900, 1.5);
const cardImgPl = document.createElement("img");
const cardImgEn = document.createElement("img");
cardImgPl.src = "img/card_pl.png";
cardImgEn.src = "img/card_en.png";

const rects = [document.createElement("img"), document.createElement("img")];
rects[0].src = "img/rect_dark.png";
rects[1].src = "img/rect_light.png";

const icons = {
  "facebook": document.createElement("img"),
  "mail": document.createElement("img"),
  "phone": document.createElement("img"),
  "instagram": document.createElement("img"),
  "twitter": document.createElement("img")
};
icons["facebook"].src = "img/facebook.png";
icons["mail"].src = "img/mail.png";
icons["phone"].src = "img/phone.png";
icons["instagram"].src = "img/instagram.png";
icons["twitter"].src = "img/twitter.png";

const nameInput = document.getElementById("name");
const descInput = document.getElementById("desc");
const polishRadio = document.getElementById("polishRadio");
const nameFontSpinner = document.getElementById("nameFont");
const socialMarginSpinner = document.getElementById("socialMargin");

function repaint(event) {

  let context = canvas.getContext("2d");
  if (polishRadio.checked) {
    context.drawImage(cardImgPl, 0, 0);
  }
  else {
    context.drawImage(cardImgEn, 0, 0);
  }

  //socials
  let selectedCheckboxes = document.querySelectorAll('.option');
  selectedCheckboxes = [].filter.call( selectedCheckboxes, (el) => el.checked);

  const socialsNumber = selectedCheckboxes.length;
  const heightOfRectangle = rects[0].height;
  const rectangleMargin = parseInt(socialMarginSpinner.value);

  const socialsContainerHeight = 490.0;
  const socialsContainerY = 174 + (socialsContainerHeight - (socialsNumber * heightOfRectangle + (socialsNumber - 1)
    * rectangleMargin)) / 2.0;

  context.fillStyle = "#636262";
  context.font = "40px Roboto";

  for (let i = 0; i < socialsNumber; i++) {
    const y = socialsContainerY + (rectangleMargin + heightOfRectangle) * i;
    const text = document.getElementById(selectedCheckboxes[i].id.replace("Checkbox", "Value")).value;
    context.drawImage(rects[i % 2], 112, y);
    context.drawImage(icons[selectedCheckboxes[i].id.replace("Checkbox", "")], 112, y);
    context.fillText(text, 222,  y + 48);
  }


  //lower section
  if (descInput.value.length > 0) {
    // name
    context.fillStyle = "white";
    context.font = "bold " + nameFontSpinner.value + "px Roboto";
    context.fillText(nameInput.value, 47,  784);

    // desc
    context.fillStyle = "white";
    context.font = "lighter 34px Roboto";
    context.fillText(descInput.value, 47,  848);
  }
  else {
    // name
    context.fillStyle = "white";
    context.font = "bold 86px Roboto";
    context.fillText(nameInput.value, 47,  815);
  }
}

function download(event) {
  const link = document.createElement('a');
  link.download = 'card.png';
  link.href = canvas.toDataURL();
  link.click();
  event.preventDefault();
}

window.onload = function () {
  document.getElementById("canvasContainer").append(canvas);
  repaint();
};

//set listeners to all inputs
document.querySelectorAll("input").forEach(function (el) {
  el.addEventListener("input", repaint);
});

document.getElementById("download").addEventListener("click", download);