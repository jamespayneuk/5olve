import { Entry } from "../pages/api/word";

function score(aim: string, chosen: string): Entry[] {
  const entry: Entry[] = [];
  Array.from(chosen).forEach((letter, index) => {
    if (aim[index] === letter) {
      entry.push({letter, color: "green"})
    } else if (aim.includes(letter)) {
      entry.push({letter, color: "yellow"})
    } else {
      entry.push({letter, color: "gray"})
    }
  })
  return entry;
}

type getBestWord = (dictionary: string[], guesses: Entry[][]) => [string, string[]]

export function evaluate(dictionary: string[], getBestWord: getBestWord): number[] {
  const scores = dictionary.map((aim, i) => {
    if (i % 100 === 0) {
      console.log(i,"/",dictionary.length);
    }
    const attempts: Entry[][] = [];
    while (true) {
      const [word, remainingGuesses] = getBestWord(dictionary, attempts);
      if (word === aim) {
        break;
      }
      attempts.push(score(aim, word));
    }
    return attempts.length + 1;
  })
  return scores
}