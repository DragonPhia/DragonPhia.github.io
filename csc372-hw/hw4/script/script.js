const choices = ["rock", "paper", "scissors"];
const playerChoices = document.querySelectorAll(".choice-box");
const computerImage = document.getElementById("computer-choice");
const resultText = document.getElementById("result");
const resetButton = document.getElementById("reset-button");
const scoreboard = document.getElementById("scoreboard");

let playerChoice = "";
let scores = { wins: 0, losses: 0, ties: 0 };

playerChoices.forEach(choiceBox => {
    choiceBox.addEventListener("click", () => {
        const choice = choiceBox.querySelector("img");

        playerChoices.forEach(box => box.classList.remove("selected"));

        choiceBox.classList.add("selected");

        playerChoice = choice.id;
        computerPlay();
    });
});

function computerPlay() {
    computerImage.src = "images/question-mark.PNG"; 
    let index = 0;

    let shuffleInterval = setInterval(() => {
        computerImage.src = `images/${choices[index]}.PNG`;
        index = (index + 1) % choices.length;
    }, 500);

    setTimeout(() => {
        clearInterval(shuffleInterval);
        let computerChoice = choices[Math.floor(Math.random() * choices.length)];
        computerImage.src = `images/${computerChoice}.PNG`;

        const computerChoiceBox = document.querySelector(".computer-choice-box");
        computerChoiceBox.classList.add("selected");

        determineWinner(playerChoice, computerChoice);
    }, 3000);
}

resetButton.addEventListener("click", () => {
    playerChoices.forEach(img => img.classList.remove("selected"));
    computerImage.src = "images/question-mark.PNG"; 
    resultText.textContent = "Make your move!";
    scores = { wins: 0, losses: 0, ties: 0 };
    updateScoreDisplay();
});

function determineWinner(player, computer) {
    if (player === computer) {
        resultText.textContent = "It's a tie!";
        scores.ties++;
    } else if (
        (player === "rock" && computer === "scissors") ||
        (player === "paper" && computer === "rock") ||
        (player === "scissors" && computer === "paper")
    ) {
        resultText.textContent = "You win!";
        scores.wins++;
    } else {
        resultText.textContent = "Computer wins!";
        scores.losses++;
    }
    updateScoreDisplay();
}

function updateScoreDisplay() {
    scoreboard.textContent = `Wins: ${scores.wins} | Losses: ${scores.losses} | Ties: ${scores.ties}`;
}

resetButton.addEventListener("click", () => {
    playerChoices.forEach(img => img.classList.remove("selected"));  
    computerImage.classList.remove("selected");
    computerImage.src = "images/question-mark.PNG";  
    
    const computerChoiceBox = document.querySelector(".computer-choice-box");
    computerChoiceBox.classList.remove("selected");  
    
    resultText.textContent = "Make your move!";  
    
    scores = { wins: 0, losses: 0, ties: 0 };  
    
    updateScoreDisplay();  
});