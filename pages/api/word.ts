import {NextApiRequest, NextApiResponse} from "next";
import { evaluate } from "../../assets/eval";
import {words as allWords} from "../../assets/words";

export type Color = "green" | "yellow" | "gray";
export interface Entry {letter: string, color: Color}
export type Word = Entry[]
interface Request {
  words: Entry[][]
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const data: Request = JSON.parse(req.body);
  const word = getBetterWord(allWords, data.words);
  res.status(200).json({word});
}

export function getBetterWord(dictionary: string[], guesses: Word[]): string {
  const possibleWords = removeWords(dictionary, guesses);
  if (possibleWords.length === 1) {
    return possibleWords[0]
  }
  const newGuesses = removeGuessedLetters(dictionary, guesses);
  if (newGuesses.length === 0) {
    const frequencies = getFrequencies(possibleWords);
    const word = getHighestValueWord(possibleWords, frequencies);
    return word;
  }
  const frequencies = getFrequencies(newGuesses);
  const word = getHighestValueWord(newGuesses, frequencies);
  return word;
}

function removeGuessedLetters(dictionary: string[], words: Word[]) {
  let newDictionary = [...dictionary];
  words.forEach((word) => {
    word.forEach((letter) => {
      newDictionary = newDictionary.filter(dictEntry => {
        return !dictEntry.includes(letter.letter)
      })

    })
  })
  return newDictionary;
}

function removeAlreadyGuessedLettersFromFrequencies(freq: {[k: string]: number}, guesses: Word[]) {
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

function getFrequencies(words: string[]): {[k: string]: number} {
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


function removeWords(dictionary: string[], words: Entry[][]): string[] {
  let newDictionary = [...dictionary];
  words.forEach((word) => {
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

function getHighestValueWord(dictionary: string[], letterScores: {[k: string]: number}): string {
  const wordScores = dictionary.map(word => [
    word, 
    Array.from(new Set(word)).reduce((p,c) => p + (letterScores[c] ?? 0), 0)
  ]);
  return wordScores.reduce((p, c) => c[1] > p[1] ? c : p, ["unknown", 0])[0] as string;
}

function getBestWord(dictionary: string[], guesses: Entry[][]): string {
  const possibleWords = removeWords(dictionary, guesses);
  const frequencies = getFrequencies(possibleWords);
  return getHighestValueWord(possibleWords, frequencies);
}