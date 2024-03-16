const expandBtn = document.querySelector(".expand-btn");
const cardContent = document.querySelector(".card-content");

expandBtn.addEventListener("click", () => {
  cardContent.classList.toggle("expanded");
  expandBtn.classList.toggle("expanded");
});
