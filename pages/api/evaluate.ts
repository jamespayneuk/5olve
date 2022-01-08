import {NextApiRequest, NextApiResponse} from "next";
import { evaluate } from "../../assets/eval";
import {words as allWords} from "../../assets/words";
import { getBetterWord } from "./word";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // const data: Request = JSON.parse(req.body);

  const [results, summary] = evaluate(allWords, getBetterWord);
  const totalAttempts = results.reduce((p,c) => p+c, 0);
  const averageScore = totalAttempts / results.length;

  // const word = getBetterWord(allWords, data.words);
  res.status(200).json({averageScore, summary});
}