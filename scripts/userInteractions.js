const navBar = document.querySelector(".nav-bar");
const burgerMenu = document.querySelector(".nav-bar__burger-menu");
const quoteElement = document.querySelector(".quotes-element");

quoteElement.addEventListener("click", (e) => {
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
  if(!quoteElement.contains(event.target)){
    quoteElement.classList.remove("--flipped");
  }
})


for (let i = 0; i < navBar.children.length; i++) {
  navBar.children[1].children[i].addEventListener("click", () => {
    closeNavBarList();
  });
}

function closeNavBarList() {
  navBar.classList.remove("--active");
  burgerMenu.classList.remove("--active");
}
