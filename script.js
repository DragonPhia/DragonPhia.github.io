document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.querySelector(".dropdown-toggle");
    const courseContainer = document.getElementById("courseContainer");

    toggleButton.addEventListener("click", function () {
        courseContainer.classList.toggle("expanded");
        toggleButton.classList.toggle("active");
    });
});