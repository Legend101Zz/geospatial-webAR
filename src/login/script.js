document.addEventListener("DOMContentLoaded", () => {
  // Show splash screen for 3-4 seconds
  setTimeout(() => {
    // Hide splash screen
    const splashContainer = document.querySelector(".splash-container");
    splashContainer.style.display = "none";

    // Show signup form
    const signupContainer = document.getElementById("signupContainer");
    signupContainer.style.opacity = "1";
    signupContainer.classList.remove("hidden");
  }, 3000);
});

function togglePasswordVisibility() {
  const passwordInput = document.getElementById("password");
  const visibilityIcon = document.querySelector(".visibility-icon");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    visibilityIcon.textContent = "🙈";
  } else {
    passwordInput.type = "password";
    visibilityIcon.textContent = "👁️";
  }
}

const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  // Add your form submission logic here
  // You can access form fields using signupForm.elements
  // For example: signupForm.elements['firstName'].value
});
