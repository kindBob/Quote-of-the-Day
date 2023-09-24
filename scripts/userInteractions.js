const navBarList = document.querySelector(".nav-bar__list");
const burgerMenu = document.querySelector(".nav-bar__burger-menu");
const quoteElement = document.querySelector(".quotes-element");

quoteElement.addEventListener("click", (e) => {
  quoteElement.classList.toggle("--flipped");
});

burgerMenu.addEventListener("click", () => {
  navBarList.classList.toggle("--active");
  burgerMenu.classList.toggle("--active");

  navBarList.classList.contains("--active")
    ? (document.body.style.overflow = "hidden")
    : (document.body.style.overflow = "auto");
});

for (let i = 0; i < navBarList.children.length; i++) {
  navBarList.children[i].addEventListener("click", () => {
    closeNavBarList();
  });
}

function closeNavBarList() {
  console.log(1);
  navBarList.classList.remove("--active");
  burgerMenu.classList.remove("--active");
}
