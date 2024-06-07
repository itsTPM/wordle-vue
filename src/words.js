import allWords from "@/allWords.json";

export const todayWord = () => {
  const date = new Date();

  // such a weird algorithm
  const todayIndex = +`${String(date.getFullYear()).slice(2, 4)}${String(
    date.getDay()
  ).slice(0, 1)}${String(date.getMonth()).slice(0, 1)}`;

  return allWords[todayIndex];
};

// check if the word is in the list
export const checkWord = (word) => {
  return !!allWords.includes(word);
};
