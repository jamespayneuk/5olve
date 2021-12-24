import {NextApiRequest, NextApiResponse} from "next";
import { evaluate } from "../../assets/eval";
import {words as allWords} from "../../assets/words";
import { getBetterWord } from "./word";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // const data: Request = JSON.parse(req.body);

  const results = evaluate(allWords, getBetterWord);
  const sum = results.reduce((p,c) => p+c, 0);
  console.log(sum/results.length);

  // const word = getBetterWord(allWords, data.words);
  res.status(200).json(results);
}