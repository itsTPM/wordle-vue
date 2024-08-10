import { defineStore } from "pinia";
import { todayWord, randomWord, checkWord } from "@/words.js";
import { useStatisticsStore } from "./statistics.js";
import { toast } from "vue-sonner";

export const useGameStore = defineStore("game", {
  state: () => {
    return {
      letterLimit: 5,
      rows: 6,
      word: "",
      inputWord: "",
      guesses: [],
      currentGuess: 0,
      isGameWon: false,
      isGameLost: false,
      currentGameMode: "wordOfTheDay", // 'wordOfTheDay', 'random' or 'custom'
      guessesComparison: [],
      letters: [..."abcdefghijklmnopqrstuvwxyz"],
      lettersComparison: {},
    };
  },
  actions: {
    initGame() {
      this.currentGuess = 0;
      this.inputWord = "";
      this.guesses = Array(this.rows).fill("");
      this.guessesComparison = Array(this.rows).fill("");
      this.isGameWon = false;
      this.isGameLost = false;

      for (const letter of this.letters) {
        this.lettersComparison[letter] = "";
      }
    },
    changeGameMode(newMode) {
      this.currentGameMode = newMode;

      this.initGame();

      if (newMode === "random") {
        this.word = randomWord();
      } else {
        this.word = todayWord();
      }
    },
    addLetter(letter) {
      if (this.inputWord.length < this.letterLimit) {
        this.inputWord += letter.toLowerCase();
        this.guesses[this.currentGuess] = this.inputWord;
      }
    },
    removeLastLetter() {
      this.inputWord = this.inputWord.slice(0, -1);
      this.guesses[this.currentGuess] = this.inputWord;
    },
    makeGuess() {
      const statisticsStore = useStatisticsStore();

      if (this.inputWord.length !== this.letterLimit) {
        toast("Not enough letters!");
        return;
      }

      if (!checkWord(this.inputWord)) {
        toast("Not a valid word!");
        return;
      }

      const guess = this.inputWord;
      const target = this.word;
      this.inputWord = "";

      const result = Array(this.letterLimit).fill("N");
      const targetLetterCount = {};

      // Count the letters in the target word
      for (const letter of target) {
        targetLetterCount[letter] = (targetLetterCount[letter] || 0) + 1;
      }

      // First pass: find correct letters (Y)
      for (let i = 0; i < this.letterLimit; i++) {
        if (guess[i] === target[i]) {
          result[i] = "Y";
          targetLetterCount[guess[i]]--;
          this.setLetterComparison(target[i], "Y");
        }
      }

      // Second pass: find misplaced letters (X)
      for (let i = 0; i < this.letterLimit; i++) {
        if (
          result[i] !== "Y" &&
          target.includes(guess[i]) &&
          targetLetterCount[guess[i]] > 0
        ) {
          result[i] = "X";
          targetLetterCount[guess[i]]--;
          this.setLetterComparison(guess[i], "X");
        }
      }

      for (let i = 0; i < result.length; i++) {
        const letter = result[i];

        if (letter == "N") {
          this.setLetterComparison(guess[i], "N");
        }
      }

      this.guesses[this.currentGuess] = guess;
      this.guessesComparison[this.currentGuess] = result.join("");

      if (guess === target) {
        statisticsStore.pushToStatistics(this.currentGameMode, "win");
        setTimeout(() => {
          this.isGameWon = true;
        }, 1000);
      } else if (this.currentGuess === this.rows - 1) {
        statisticsStore.pushToStatistics(this.currentGameMode, "lose");
        this.isGameLost = true;
      }

      this.currentGuess++;
    },
    setLetterComparison(letter, match) {
      if (
        (match === "X" && this.lettersComparison[letter] === "Y") ||
        (match === "N" && this.lettersComparison[letter] === "X") ||
        (match === "N" && this.lettersComparison[letter] === "Y")
      ) {
        return;
      }

      this.lettersComparison[letter] = match;
    },
  },
});
