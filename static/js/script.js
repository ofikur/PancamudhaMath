document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const levelButtons = document.querySelectorAll(".level-btn");
  const startGameButton = document.getElementById("start-game");

  // Default level
  let selectedLevel = 1;

  // Add event listeners to level buttons
  levelButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      levelButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to selected button
      this.classList.add("active");

      // Update selected level
      selectedLevel = parseInt(this.getAttribute("data-level"));

      // Add visual effect to show selection
      this.style.transform = "scale(1.05)";
      setTimeout(() => {
        this.style.transform = "";
      }, 200);
    });
  });

  // Start game button event listener
  startGameButton.addEventListener("click", function () {
    // Add click effect
    this.style.transform = "scale(0.95)";
    setTimeout(() => {
      this.style.transform = "";

      // Redirect to game page with selected level
      window.location.href = `/game?level=${selectedLevel}`;
    }, 200);
  });

  // Add hover effects to buttons for better UI experience
  const allButtons = document.querySelectorAll("button");
  allButtons.forEach((button) => {
    button.addEventListener("mouseenter", function () {
      this.style.transition = "all 0.3s ease";
      this.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.3)";
    });

    button.addEventListener("mouseleave", function () {
      this.style.transition = "all 0.3s ease";
      this.style.boxShadow = "";
    });
  });

  // Create animated background particles
  createParticles();
});

// Function to create animated background particles
function createParticles() {
  const container = document.querySelector(".container");

  // Create 20 particles
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");

    // Random positioning
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const size = Math.random() * 5 + 2;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;

    // Apply styles
    particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            top: ${posY}%;
            left: ${posX}%;
            pointer-events: none;
            opacity: 0;
            animation: float ${duration}s infinite ease-in-out ${delay}s;
        `;

    container.appendChild(particle);
  }

  // Add CSS animation for particles
  const style = document.createElement("style");
  style.textContent = `
        @keyframes float {
            0%, 100% {
                transform: translateY(0) translateX(0);
                opacity: 0;
            }
            25% {
                opacity: 0.5;
            }
            50% {
                transform: translateY(-100px) translateX(20px);
                opacity: 0.2;
            }
            75% {
                opacity: 0.5;
            }
        }
    `;
  document.head.appendChild(style);
}
