// game.js - Game functionality for PancamudhaMath

document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const questionText = document.getElementById("question");
  const questionNumber = document.getElementById("question-number");
  const answerInput = document.getElementById("answer-input");
  const submitAnswerBtn = document.getElementById("submit-answer");
  const nextQuestionBtn = document.getElementById("next-question");
  const endGameBtn = document.getElementById("end-game");
  const feedbackContainer = document.getElementById("feedback");
  const scoreDisplay = document.getElementById("score");
  const levelDisplay = document.getElementById("level");
  const timerDisplay = document.getElementById("timer");

  // Results screen elements
  const resultsScreen = document.querySelector(".results-screen");
  const gameScreen = document.querySelector(".game-screen");
  const finalScoreDisplay = document.getElementById("final-score");
  const questionsAnsweredDisplay =
    document.getElementById("questions-answered");
  const accuracyDisplay = document.getElementById("accuracy");
  const timeTakenDisplay = document.getElementById("time-taken");
  const timeBonusDisplay = document.getElementById("time-bonus");
  const achievementText = document.getElementById("achievement-text");
  const starRating = document.querySelector(".star-rating");
  const playAgainBtn = document.getElementById("play-again");
  const backToHomeBtn = document.getElementById("back-to-home");

  // Game variables
  let currentQuestion = "";
  let currentAnswer = null;
  let score = 0;
  let questionsAsked = 0;
  let questionsCorrect = 0;
  let level = 1;
  let timeLeft = 60; // 60 seconds game time
  let timerInterval;
  let gameStartTime;

  // Parse level from URL if available
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("level")) {
    level = parseInt(urlParams.get("level"));
    if (isNaN(level) || level < 1 || level > 3) level = 1;
  }

  // Initialize game
  function initGame() {
    // Set initial level display
    levelDisplay.textContent = level;

    // Reset game variables
    score = 0;
    questionsAsked = 0;
    questionsCorrect = 0;
    scoreDisplay.textContent = "0";

    // Reset timer
    timeLeft = 60;
    timerDisplay.textContent = timeLeft;

    // Record start time
    gameStartTime = new Date();

    // Start timer
    startTimer();

    // Load first question
    getNextQuestion();

    // Hide next question button initially
    nextQuestionBtn.style.display = "none";

    // Focus on answer input
    answerInput.focus();
  }

  // Start the timer
  function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = timeLeft;

      // Change color when time is running out
      if (timeLeft <= 10) {
        timerDisplay.style.color = "#e74c3c";
        timerDisplay.style.animation = "pulse 0.5s infinite alternate";
      }

      // End game when time is up
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        endGame();
      }
    }, 1000);
  }

  // Get next question from server
  function getNextQuestion() {
    // Show loading state
    questionText.textContent = "Memuat soal...";
    feedbackContainer.textContent = "";
    feedbackContainer.className = "feedback-container";
    answerInput.value = "";
    answerInput.disabled = false;
    submitAnswerBtn.disabled = false;
    nextQuestionBtn.style.display = "none";

    // Increment question number
    questionsAsked++;
    questionNumber.textContent = questionsAsked;

    // Fetch new question from server
    const formData = new FormData();
    formData.append("level", level);

    fetch("/get_question", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // Update UI with new question
        questionText.textContent = data.question;
        currentQuestion = data.question;

        // Focus on answer input
        answerInput.focus();
      })
      .catch((error) => {
        console.error("Error fetching question:", error);
        questionText.textContent = "Error memuat soal. Silakan coba lagi.";
        feedbackContainer.textContent = "Terjadi kesalahan saat memuat soal.";
        feedbackContainer.className = "feedback-container incorrect";
      });
  }

  // Submit answer handler
  function submitAnswer() {
    if (answerInput.value.trim() === "") {
      feedbackContainer.textContent = "Masukkan jawaban terlebih dahulu!";
      feedbackContainer.className = "feedback-container incorrect";
      answerInput.focus();
      return;
    }

    // Disable input and button to prevent multiple submissions
    answerInput.disabled = true;
    submitAnswerBtn.disabled = true;

    // Prepare form data
    const formData = new FormData();
    formData.append("answer", answerInput.value);

    // Send answer to server for checking
    fetch("/check_answer", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // Update score
        score = data.score;
        scoreDisplay.textContent = score;

        // Show feedback
        if (data.is_correct) {
          feedbackContainer.textContent = "✓ Benar! Jawaban yang tepat.";
          feedbackContainer.className = "feedback-container correct";
          questionsCorrect++;

          // Add visual celebration
          createConfetti();
        } else {
          feedbackContainer.textContent = `✗ Jawaban salah. Jawaban yang benar adalah: ${data.correct_answer}`;
          feedbackContainer.className = "feedback-container incorrect";
        }

        // Show next question button
        nextQuestionBtn.style.display = "inline-block";
        nextQuestionBtn.focus();
      })
      .catch((error) => {
        console.error("Error checking answer:", error);
        feedbackContainer.textContent =
          "Terjadi kesalahan saat memeriksa jawaban.";
        feedbackContainer.className = "feedback-container incorrect";
      });
  }

  // End game and show results
  function endGame() {
    // Clear timer
    clearInterval(timerInterval);

    // Calculate time taken
    const gameEndTime = new Date();
    const timeTaken = Math.floor((gameEndTime - gameStartTime) / 1000);

    // Send end game data to server
    fetch("/end_game", {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        // Update results screen
        finalScoreDisplay.textContent = data.final_score;
        questionsAnsweredDisplay.textContent = data.questions_asked;
        accuracyDisplay.textContent = data.accuracy + "%";
        timeTakenDisplay.textContent = formatTime(data.time_taken);
        timeBonusDisplay.textContent = data.time_bonus;

        // Set achievement text based on score
        setAchievement(data.final_score, data.accuracy);

        // Update star rating
        updateStarRating(data.final_score, data.accuracy);

        // Hide game screen and show results screen
        gameScreen.style.display = "none";
        resultsScreen.style.display = "flex";
      })
      .catch((error) => {
        console.error("Error ending game:", error);
        alert("Terjadi kesalahan saat mengakhiri permainan.");
      });
  }

  // Format time in MM:SS format
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  }

  // Set achievement text based on score and accuracy
  function setAchievement(score, accuracy) {
    if (score >= 1000 && accuracy >= 90) {
      achievementText.textContent =
        "🏆 Luar Biasa! Kamu adalah Master Matematika!";
      achievementText.style.color = "#FFD700";
    } else if (score >= 700 && accuracy >= 80) {
      achievementText.textContent =
        "🌟 Hebat! Kemampuan matematikamu sangat baik!";
      achievementText.style.color = "#FFFFFF";
    } else if (score >= 400 && accuracy >= 70) {
      achievementText.textContent =
        "👍 Bagus! Kamu memiliki pemahaman yang baik.";
      achievementText.style.color = "#FFFFFF";
    } else if (score >= 200) {
      achievementText.textContent = "🙂 Lumayan! Teruslah berlatih matematika.";
      achievementText.style.color = "#FFFFFF";
    } else {
      achievementText.textContent =
        "💪 Tetap semangat! Latihan adalah kunci keberhasilan.";
      achievementText.style.color = "#FFFFFF";
    }
  }

  // Update star rating based on score and accuracy
  function updateStarRating(score, accuracy) {
    // Get all stars
    const stars = starRating.querySelectorAll("i");

    // Reset all stars to empty
    stars.forEach((star) => {
      star.className = "far fa-star";
    });

    // Calculate star rating (max 5)
    let starCount = 0;

    if (score >= 1000 && accuracy >= 90) {
      starCount = 5;
    } else if (score >= 700 && accuracy >= 80) {
      starCount = 4;
    } else if (score >= 400 && accuracy >= 70) {
      starCount = 3;
    } else if (score >= 200 && accuracy >= 60) {
      starCount = 2;
    } else {
      starCount = 1;
    }

    // Update stars display
    for (let i = 0; i < starCount; i++) {
      stars[i].className = "fas fa-star";
    }

    // Add animation to stars
    stars.forEach((star, index) => {
      setTimeout(() => {
        star.style.animation = "pulse 0.5s";
      }, index * 200);
    });
  }

  // Create confetti effect for correct answers
  function createConfetti() {
    for (let i = 0; i < 30; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";

      // Random position, color, and size
      const posX = Math.random() * 100;
      const posY = 0;
      const colors = ["#ff718d", "#fdbb2d", "#22c1c3", "#c471ed", "#7ee8fa"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 8 + 6;
      const duration = Math.random() * 3 + 2;

      // Apply styles
      confetti.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background-color: ${color};
                top: ${posY}%;
                left: ${posX}%;
                opacity: 1;
                pointer-events: none;
                animation: confettiFall ${duration}s forwards;
                z-index: 1000;
            `;

      document.body.appendChild(confetti);

      // Remove after animation
      setTimeout(() => {
        document.body.removeChild(confetti);
      }, duration * 1000);
    }

    // Add animation style if not already added
    if (!document.getElementById("confetti-style")) {
      const style = document.createElement("style");
      style.id = "confetti-style";
      style.textContent = `
                @keyframes confettiFall {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }
            `;
      document.head.appendChild(style);
    }
  }

  // Event Listeners
  submitAnswerBtn.addEventListener("click", submitAnswer);

  answerInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      submitAnswer();
    }
  });

  nextQuestionBtn.addEventListener("click", getNextQuestion);

  endGameBtn.addEventListener("click", endGame);

  playAgainBtn.addEventListener("click", function () {
    // Reset and restart game
    location.reload();
  });

  backToHomeBtn.addEventListener("click", function () {
    // Go back to home page
    window.location.href = "/";
  });

  // Initialize game when page loads
  initGame();
});
