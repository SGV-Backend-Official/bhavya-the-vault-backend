const generateTournamentCode = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const firstLetter = letters[Math.floor(Math.random() * letters.length)];

  const secondLetter = letters[Math.floor(Math.random() * letters.length)];

  const number = Math.floor(100 + Math.random() * 900);

  return `${firstLetter}${secondLetter}-${number}`;
};

export { generateTournamentCode };

// This function generates a unique tournament code consisting of two random uppercase letters followed by a three-digit number. The letters are selected randomly from the English alphabet, and the number is generated to be between 100 and 999. The resulting code is returned as a string in the format "XY-123".
