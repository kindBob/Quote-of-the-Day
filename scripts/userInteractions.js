const navBar = document.querySelector(".nav-bar");
const burgerMenu = document.querySelector(".nav-bar__burger-menu");
const quoteElement = document.querySelector(".quotes-element");

const shareCard = document.querySelector("#share-card");
const shareButton = document.querySelector("#quotes-element__share-button");

//Share
shareButton.addEventListener("click", () => {
  html2canvas(shareCard, { dpi: 300 }).then((canvas) => {
    const imageDataUrl = canvas.toDataURL("image/png", 1.0);

    if (navigator.share) {
      navigator
        .share({
          title: "My quote of the Day",
          text: "Check this out!",
          files: [
            new File([dataURItoBlob(imageDataUrl)], "quote-card.png", {
              type: "image/png",
            }),
          ],
        })
        .then(() => console.log("Sharing works!"))
        .catch((error) => console.log(`Problems occured: ${error}`));
    } else {
      alert("Your browser doesn't support sharing yet");
    }
  });
});

function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeString });
}
// Share ---
quoteElement.addEventListener("click", (event) => {
  if (event.target.id != "quotes-element__share-button")
    quoteElement.classList.toggle("--flipped");
});

burgerMenu.addEventListener("click", () => {
  navBar.classList.toggle("--active");
  burgerMenu.classList.toggle("--active");

  navBar.classList.contains("--active")
    ? (document.body.style.overflow = "hidden")
    : (document.body.style.overflow = "auto");
});

document.addEventListener("click", (event) => {
  if (!quoteElement.contains(event.target)) {
    quoteElement.classList.remove("--flipped");
  }
});

for (let i = 0; i < navBar.children.length; i++) {
  navBar.children[1].children[i].addEventListener("click", () => {
    closeNavBarList();
  });
}

function closeNavBarList() {
  navBar.classList.remove("--active");
  burgerMenu.classList.remove("--active");
}
