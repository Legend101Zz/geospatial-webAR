window.addEventListener("load", function () {
  const container = document.querySelector(".container");
  container.style.display = "none";

  setTimeout(function () {
    container.style.display = "block";
  }, 1000); // Delay of 1 second (1000 milliseconds)
});
