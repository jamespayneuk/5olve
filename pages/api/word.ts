import {NextApiRequest, NextApiResponse} from "next";
import {words as allWords, words} from "../../assets/words";

type Color = "green" | "yellow" | "gray";
interface Entry {letter: string, color: Color}
interface Request {
  words: Entry[][]
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const scores = words.map((aim, i) => {
    console.log(i,"/",words.length)
    const attempts: Entry[][] = [];
    while (true) {
      const possibleWords = removeWords(allWords, attempts);
      const freq = getFrequencies(possibleWords);
      const word = getBestWord(possibleWords, freq);
      if (word === aim) {
        break;
      }
      attempts.push(score(aim, word));
    }
    return attempts.length + 1;
  })
  // const sum = scores.reduce((a, b) => a + b, 0);
  // const avg = (sum / scores.length) || 0;
  res.json(scores);





  // if (!Array.isArray(req.body.words)) {
  //   res.status(400).json({ ok: false })
  //   return;
  // }
  // fancy
  // const data: Request = {
  //   words: [
  //     [
  //       {letter: "a", color: "yellow"},
  //       {letter: "r", color: "gray"},
  //       {letter: "o", color: "gray"},
  //       {letter: "s", color: "gray"},
  //       {letter: "e", color: "gray"},
  //     ],
  //     [
  //       {letter: "i", color: "gray"},
  //       {letter: "n", color: "yellow"},
  //       {letter: "l", color: "gray"},
  //       {letter: "a", color: "yellow"},
  //       {letter: "y", color: "green"},
  //     ],
  //     [
  //       {letter: "c", color: "yellow"},
  //       {letter: "a", color: "green"},
  //       {letter: "n", color: "green"},
  //       {letter: "d", color: "gray"},
  //       {letter: "y", color: "green"},
  //     ]
  //   ]
  // }

  // const possibleWords = removeWords(allWords, data.words);
  // const freq = getFrequencies(possibleWords);
  // res.status(200).json({word: getBestWord(possibleWords, freq)});
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

function getBestWord(dictionary: string[], frequencies: {[k: string]: number}): string {
  const wordScores = dictionary.map(word => [
    word, 
    Array.from(new Set(word)).reduce((p,c) => p + frequencies[c] ?? 0, 0)
  ]);
  return wordScores.reduce((p, c) => c[1] > p[1] ? c : p, ["unknown", 0])[0] as string;
}

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