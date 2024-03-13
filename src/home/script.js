window.addEventListener("load", function () {
  const container = document.querySelector(".container");
  container.style.display = "none";

  setTimeout(function () {
    container.style.display = "block";
  }, 1000); // Delay of 1 second (1000 milliseconds)
});

const calendarHeader = document.querySelector(".calendar-header");
const days = document.querySelector(".days");
const dates = document.querySelector(".dates");
const toggleIcon = calendarHeader.querySelector(".nav-icon");

let showingDates = true;

toggleIcon.addEventListener("click", () => {
  showingDates = !showingDates;

  if (showingDates) {
    days.style.display = "none";
    dates.style.display = "flex";
    toggleIcon.innerHTML = "&#9662;"; // Down arrow
  } else {
    days.style.display = "flex";
    dates.style.display = "none";
    toggleIcon.innerHTML = "&#9652;"; // Up arrow
  }
});

// Function to animate the points-circle-value
function animatePointsCircleValue() {
  const pointsCircleValue = document.querySelector(".points-circle-value");
  const targetValue = parseInt(pointsCircleValue.textContent);
  let currentValue = 0;

  const animationInterval = setInterval(() => {
    pointsCircleValue.textContent = currentValue;
    currentValue++;

    if (currentValue > targetValue) {
      clearInterval(animationInterval);
    }
  }, 5);
}

// Function to animate the item values
function animateItemValues() {
  const itemValues = document.querySelectorAll(".item-value");

  itemValues.forEach((itemValue) => {
    const targetValue = parseInt(itemValue.textContent);
    let currentValue = 0;

    const animationInterval = setInterval(() => {
      itemValue.textContent = currentValue;
      currentValue++;

      if (currentValue > targetValue) {
        clearInterval(animationInterval);
      }
    }, 5);
  });

  const pointsCircleValue = document.querySelector(".points-circle-value");
  const targetValue = parseInt(pointsCircleValue.textContent);
  let currentValue = 0;

  const animationInterval = setInterval(() => {
    pointsCircleValue.textContent = currentValue;
    currentValue++;

    if (currentValue > targetValue) {
      clearInterval(animationInterval);
    }
  }, 5);
}

// Call the function to start the animation

animateItemValues();
