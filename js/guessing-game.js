/* 

Write your guess-game code here! Don't forget to look at the test specs as a guide. You can run the specs
by running "testem".

In this file, you will also include the event listeners that are needed to interact with your HTML file when
a user clicks a button or adds a guess to the input field.

*/

/* 
NUMBER GUESSING GAME
Implement the missing code based on the comments
*/

// Generate random number between 1-100 (inclusive)
function generateWinningNumber() {
  // Return random integer
  const randomNum = Math.floor(Math.random() * 100) + 1;
  return randomNum;
}

// Shuffle array using Fisher-Yates algorithm
function shuffle(array) {
  // Modify array in place and return it
  for(let i=array.length-1; i>0; i--){
    let j = Math.floor(Math.random() * (i+1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;

}

class Game {
  constructor() {
    // Initialize properties:
    // - playersGuess (current guess)
    // - pastGuesses (array of previous guesses)
    // - winningNumber (generated number)
    this.playersGuess =  null;
    this.pastGuesses =  [];
    this.winningNumber = generateWinningNumber(); 
    this.Over = false;
  }

  // Return absolute difference between guess and winning number
  difference() {
    // Calculate and return difference
    let diff = Math.abs(this.playersGuess - this.winningNumber);
    return diff;
  }

  // Return true if guess is lower than winning number
  isLower() {
    // Return boolean comparison
    return this.playersGuess < this.winningNumber;
  }

  // Validate and process guess
  playersGuessSubmission(num) {
    // Throw error if invalid number
    // Set playersGuess
    // Return checkGuess result
    if(typeof num !== "number" || isNaN(num) || num < 1 || num > 100){
      throw new Error("That is an invalid guess.");

    }
    this.playersGuess = num;
    return this.checkGuess();
  }

  // Evaluate guess and return feedback message
  checkGuess() {
    // Handle win condition
    // Handle duplicate guess
    // Add to pastGuesses
    // Handle max guesses
    // Return temperature feedback
    if(this.playersGuess === this.winningNumber){
      this.Over = true;
      return "You Win!";
    }
    if(this.pastGuesses.includes(this.playersGuess)){
      return "You have already guessed that number.";

    }
    this.pastGuesses.push(this.playersGuess);
    if(this.pastGuesses.length >= 5){
      this.Over = true;
      return "You Lose.";
    }

    const diff = this.difference();
    if (diff < 10) return "You're burning up!";
    else if (diff < 25) return "You're lukewarm.";
    else if (diff < 50) return "You're a bit chilly.";
    else return "You're ice cold!";
    
  }

  // Generate array with 3 numbers (winning + 2 random)
  provideHint() {
    // Create array and shuffle
    let hints = [this.winningNumber];
    while (hints.length < 3) {
      const rand = generateWinningNumber();
      if (!hints.includes(rand)) {
        hints.push(rand);
      }
    }
    return shuffle(hints);
  }
}

function newGame() {
  return new Game();
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    const guessInput = document.getElementById("player-input");
    const submitBtn = document.getElementById("submit-btn");
    const resetBtn = document.getElementById("reset-btn");
    const hintBtn = document.getElementById("hint-btn");
    const messageDisplay = document.getElementById("message");
    const pastGuessesDisplay = document.getElementById("past-guesses");

    // Display guess history
    function updatePastGuesses() {
      const guessSlots = document.querySelectorAll('.guess-slot');
      guessSlots.forEach((slot, index) => {
        if (game.pastGuesses[index] !== undefined) {
          slot.textContent = game.pastGuesses[index];
        } else {
          slot.textContent = "?";
        }
      });
    }

    let game = new Game();
          // Handle guess submission
    submitBtn.addEventListener("click", () => {
      const guess = parseInt(guessInput.value, 10);

      try {
        const result = game.playersGuessSubmission(guess);
        messageDisplay.textContent = result;
        updatePastGuesses();
      } catch (err) {
        messageDisplay.textContent = err.message;
      }

      guessInput.value = "";
    });
         // Handle reset
    resetBtn.addEventListener("click", () => {
      game = new Game();
      messageDisplay.textContent = "New game started!";
      pastGuessesDisplay.textContent = "";
      guessInput.value = "";
      const guessSlots = document.querySelectorAll('.guess-slot');
      guessSlots.forEach(slot => slot.textContent = "?");
    });
         // Handle hint
    hintBtn.addEventListener("click", () => {
      const hints = game.provideHint();
      messageDisplay.textContent = `One of these is the winning number: ${hints.join(", ")}`;
    });
  });
}
