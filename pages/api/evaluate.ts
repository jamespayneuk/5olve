import {NextApiRequest, NextApiResponse} from "next";
import { evaluate } from "../../assets/eval";
import {words as allWords} from "../../assets/words";
import { getNextBestWord } from "./word";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const [results, summary] = evaluate(allWords, getNextBestWord);
  const totalAttempts = results.reduce((p,c) => p+c, 0);
  const averageScore = totalAttempts / results.length;

  res.status(200).json({averageScore, summary});
}