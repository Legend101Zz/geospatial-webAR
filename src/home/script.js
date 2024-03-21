window.addEventListener("load", function () {
  const container = document.querySelector(".container");
  container.style.display = "none";

  setTimeout(function () {
    container.style.display = "block";
  }, 1000); // Delay of 1 second (1000 milliseconds)
});

function redirectToIndex() {
  window.location.href = "run.html";
}

// Call the function to start the animation

animateItemValues();

// Get the modal
const modal = document.getElementById("trackModal");

// Get the button that opens the modal
const arRunButton = document.querySelector(".ar-run-button");

// Get the <span> element that closes the modal
const closeBtn = document.getElementsByClassName("close-btn")[0];

// Get the AR Run SVG element
const arRunSvg = document.getElementById("ar-run-svg");

const overlay = document.getElementById("overlay");

const manSvg = document.getElementById("man");

// When the user clicks the AR Run button, open the modal
arRunButton.onclick = function () {
  // modal.style.display = "block";
  animateArRunButton();
};

// When the user clicks on the close button, close the modal
closeBtn.onclick = function () {
  modal.style.display = "none";
  stopArRunAnimation();
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    stopArRunAnimation();
  }
};

// Animation for the AR Run button
function animateArRunButton() {
  // setTimeout(function () {
  //   window.location.href = "index.html";
  // }, 1500);

  // Apply initial style to position the man SVG outside the AR button
  manSvg.style.transform = "translate(-50%, -50%) scale(0)";

  // Trigger a reflow before applying the transition to ensure initial style is applied
  void manSvg.offsetWidth;

  // Apply transition to animate the man SVG into position
  manSvg.style.transition = "transform 0.5s ease-in-out";
  manSvg.style.transform = "translate(-40%, -20%) scale(1)";

  setTimeout(() => {
    // Get the SVG image element for the man walking
    const arRunSvg = document.getElementById("ar-run-svg");

    // Add animation to the SVG image for the man walking
    arRunSvg.style.animation = "person-walking 1s forwards";

    // Get the AR text element
    const arText = document.querySelector(".ar-run-button span");

    // Add animation to the AR text
    arText.style.animation = "ar-text-animation 0.5s forwards";
  }, 500);

  setTimeout(function () {
    window.location.href = "index.html";
  }, 1500);

  // overlay.style.display = "block";
}

// Stop the AR Run button animation
function stopArRunAnimation() {
  arRunSvg.style.animation = "none";
}

const completeDay = document.querySelector(".complete_day");

function addClass() {
  completeDay.classList.toggle("active");
}

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
