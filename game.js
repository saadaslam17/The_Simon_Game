const buttonColours = ["red", "blue", "green", "yellow"];
let gamePattern = [];
let userClickedPattern = [];
let started = false;
let level = 0;
let highScore = 0;
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

// Start the game by pressing Start button or any key
$(".start").click(startGame);
$(document).keypress(function () {
    if (!started) {
        startGame();
    }
});

function startGame() {
    if (!started) {
        // Reset game state
        gamePattern = [];
        userClickedPattern = [];
        level = 0;
        started = true;

        $("#level-title").text("Level " + level);
        $("#level-up-message").text("");
        nextSequence();
        updateLeaderboard();
    }
}

// Button click handler
$(".btn").click(function () {
    const userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);

    playSound(userChosenColour);
    animatePress(userChosenColour);

    checkAnswer(userClickedPattern.length - 1);
});

// Check user's answer
function checkAnswer(currentLevel) {
    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
        if (userClickedPattern.length === gamePattern.length) {
            setTimeout(function () {
                nextSequence();
            }, 1000);
        }
    } else {
        gameOver();
    }
}

// Sequence generator
function nextSequence() {
    userClickedPattern = [];
    level++;
    $("#level-title").text("Level " + level);

    const randomNumber = Math.floor(Math.random() * 4);
    const randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);

    $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);
    playSound(randomChosenColour);

    showLevelUpMessage();
}

// Game over handling
function gameOver() {
    playSound("wrong");
    $("body").addClass("game-over");
    $("#level-title").text("Game Over, Press Any Key or Start to Restart");

    setTimeout(function () {
        $("body").removeClass("game-over");
    }, 200);

    updateHighScore();

    // Delay showing the leaderboard prompt to give time for the game over message
    setTimeout(showLeaderboardPrompt, 1000); // Delay of 1 second
    startOver();
}

// Restart the game and track high score
function startOver() {
    started = false;
    gamePattern = [];
    userClickedPattern = [];
}

// Display level-up messages every 5 levels
function showLevelUpMessage() {
    if (level % 5 === 0 && level > 0) {
        $("#level-up-message").text(`Great Job! You've reached Level ${level}!`);
        setTimeout(function () {
            $("#level-up-message").text("");
        }, 2000);
    }
}

// Button animation
function animatePress(currentColor) {
    $("#" + currentColor).addClass("pressed");
    setTimeout(function () {
        $("#" + currentColor).removeClass("pressed");
    }, 100);
}

// Play sound function
function playSound(name) {
    const audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
}

// High score tracking
function updateHighScore() {
    if (level - 1 > highScore) {
        highScore = level - 1;
        $("#high-score").text("High Score: " + highScore);
    }
}

// Leaderboard prompt
function showLeaderboardPrompt() {
    const playerName = prompt("Enter your name for the leaderboard:");
    if (playerName) {
        leaderboard.push({ name: playerName, score: level - 1 });
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 5); // Limit to top 5
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        updateLeaderboard();
    }
}

// Update leaderboard display
function updateLeaderboard() {
    $("#leaderboard-list").empty();
    leaderboard.forEach((entry, index) => {
        $("#leaderboard-list").append(
            `<li><span>${index + 1}. ${entry.name}</span> <span>${entry.score}</span></li>`
        );
    });
}