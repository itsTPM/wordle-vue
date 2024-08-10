import allWords from "@/allWords.json";

export const todayWord = () => {
  const currentDate = new Date();
  const dayStart = new Date(2024, 7, 1);
  const diff = +currentDate - +dayStart; // calculate diff in ms

  const dayIndex = Math.floor(diff / (1000 * 60 * 60 * 24)); // convert ms to days

  if (dayIndex > allWords.length) {
    return allWords[dayIndex - allWords.length];
  } else {
    return allWords[dayIndex];
  }
};

export const randomWord = () => {
  const randomIndex = Math.floor(Math.random() * allWords.length + 1); // calculate random number between 1 and words array length

  return allWords[randomIndex];
};

// check if the word is in the list
export const checkWord = (word, customWord) => {
  if (customWord) {
    return !![...allWords, customWord].includes(word);
  }
  return !!allWords.includes(word);
};
