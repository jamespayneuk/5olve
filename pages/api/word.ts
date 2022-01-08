import {NextApiRequest, NextApiResponse} from "next";
import { evaluate } from "../../assets/eval";
import {words as allWords} from "../../assets/words";

export type Color = "green" | "yellow" | "gray";
export interface Entry {letter: string, color: Color}
export type Word = Entry[]
export interface Request {
  words: Entry[][]
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const data: Request = JSON.parse(req.body);
  const [word, remainingWords] = getBetterWord(allWords, data.words);
  res.status(200).json({word, remainingWords});
}

export function getBestestWord(dictionary: string[], guesses: Word[]): string {
  const possibleWords = filterDictionaryToRemoveImpossibleWords(dictionary, guesses);
  /*
    Within possible words there are letters that I need to get more information about

    those letters I need to get more information about are the most frequent letters within the possible words, excluding the letters I've got green on
    I'm not sure what I need to do with yellow, I have some info and learning where that is might be more valuable, but also getting more information about the other letters might be more helpful
    I think yellow will be resolved by being able to switch on and off ignoreing yellow, and seeing which evaluates better

    I need to maximise the information gained about those letters.
    This is done by:
    Look at the entire dictionary, pick the word which gives the most information about the highest frequency letters.
    'Most information' means words with highest sum of letter frequencies
    I could exclude words matching green words? but think not needed.

    There reaches a point where I have enough information that it becomes more efficient to start guessing words
    This point is determined by factors:
      number of possible words remaining
  */
  return "";
}

export function getBetterWord(dictionary: string[], guesses: Word[]): [string, string[]] {
  const possibleWords = filterDictionaryToRemoveImpossibleWords(dictionary, guesses);
  if (possibleWords.length === 1) {
    return [possibleWords[0], possibleWords]
  }
  const newGuesses = removeGuessedLetters(possibleWords, guesses);
  if (newGuesses.length === 0) {
    const frequencies = getFrequencies(possibleWords);
    const unGuessedLetterFrequencies = removeAlreadyGuessedLettersFromFrequencies(frequencies, guesses)
    if (Object.keys(unGuessedLetterFrequencies).length > 2) { // this should be based on the number of letters already coloured or possible words remaining
      const outcastWord = getHighestValueWord(dictionary, unGuessedLetterFrequencies);
      return [outcastWord, possibleWords];
    }
    const word = getHighestValueWord(possibleWords, frequencies);
    return [word, possibleWords];
  }
  const frequencies = getFrequencies(newGuesses);
  const word = getHighestValueWord(newGuesses, frequencies);
  return [word, possibleWords];
}

export function removeGuessedLetters(dictionary: string[], previousGuesses: Word[]) {
  let newDictionary = [...dictionary];
  previousGuesses.forEach((word) => {
    word.forEach((letter) => {
      newDictionary = newDictionary.filter(dictEntry => {
        return !dictEntry.includes(letter.letter)
      })

    })
  })
  return newDictionary;
}

export function removeAlreadyGuessedLettersFromFrequencies(freq: {[k: string]: number}, guesses: Word[]) {
  const newFreq = {...freq};

  guesses.forEach(word => {
    word.forEach(letter => {
      if (letter.color === "green" || letter.color === "yellow") {
        delete newFreq[letter.letter];
      }
    })
  })
  return newFreq
}

export function getFrequencies(words: string[]): {[k: string]: number} {
  return words.reduce((p, word) => {
    Array.from(new Set(word)).forEach(letter => {
      if (letter in p) {
        p[letter] ++;
      } else {
        p[letter] = 1;
      }
    })
    return p;
  }, {})
}

export function filterDictionaryToRemoveImpossibleWords(dictionary: string[], previousGuesses: Entry[][]): string[] {
  let newDictionary = [...dictionary];
  previousGuesses.forEach((word) => {
    word.forEach((letter, index) => {
      newDictionary = newDictionary.filter(dictEntry => {
        if (letter.color === "green") {
          return dictEntry[index] === letter.letter
        } else if (letter.color === "yellow"){
          if (dictEntry[index] === letter.letter) {
            return false
          }
          return dictEntry.includes(letter.letter)
        } else {
          return !dictEntry.includes(letter.letter)
        }
      })

    })
  })
  return newDictionary;
}

export function getHighestValueWord(dictionary: string[], letterScores: {[k: string]: number}): string {
  const wordScores = dictionary.map(word => [
    word,
    Array.from(new Set(word)).reduce((p,c) => p + (letterScores[c] ?? 0), 0)
  ]);
  return wordScores.reduce((p, c) => c[1] > p[1] ? c : p, ["unknown", 0])[0] as string;
}

export function getBestWord(dictionary: string[], guesses: Entry[][]): string {
  const possibleWords = filterDictionaryToRemoveImpossibleWords(dictionary, guesses);
  const frequencies = getFrequencies(possibleWords);
  return getHighestValueWord(possibleWords, frequencies);
}