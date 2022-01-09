import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import LetterRow from '../components/LetterRow'
import { useEffect, useState } from 'react'
import { Entry } from './api/word'

async function getEvaluation(): Promise<[any,any]> {
  const res = await fetch("/api/evaluate")
  const json = await res.json();
  // const json = {"averageScore":4.210873718950842,"summary":{"1":1,"2":30,"3":1064,"4":2811,"5":1435,"6":347,"7":64,"8":5}}
  return [json.averageScore, json.summary];

}

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false)
  const [averageScore, setAverageScore] = useState<number>()
  const [summary, setSummary] = useState()

  const handleRun = async () => {
    setLoading(true)
    const [averageScore, summary] = await getEvaluation()
    handleReceiveData(averageScore,summary)
  }

  const handleReceiveData = (averageScore, summary) => {
    setAverageScore(averageScore)
    setSummary(summary)
  }

  const sumValues = (object: {[key: string]: number}): number => {
    return Object.values(object).reduce((a:number, b:number) => a + b)
  }

  const totalWords = summary ? sumValues(summary) : 0;
  let runningTotal = 0

  return (
    <div className={styles.container}>
      <Head>
        <title>5olve - evaluate algorithm</title>
        <meta name="description" content="5olve letter puzzle game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <LetterRow
            onChange={() => {}}
            initialLetters={Array.from("5olve")}
            initialColors={["yellow", "green", "green", "green", "green"]}
            disableArrow={true}
          />
        </h1>
        <div className="mt-4">Use this page to evaluate the performance of the algorithm</div>
        {!averageScore && !loading && <div className={styles.button} onClick={handleRun}>Run</div>}
        {!averageScore && loading &&
          <>
            <div className={styles.button}>Loading...</div>
            <div>This might take 1-2 minutes</div>
          </>
        }

        {averageScore &&
          <div>
            <div className="mt-2 text-2xl font-bold text-center">Results</div>
            <div className="text-center">
              Average Score: <span className="font-bold">{averageScore.toFixed(3)}</span> guesses
            </div>
            <div>
              <table>
                <thead>
                  <tr>
                    <th className="px-2 py-1">Guesses</th>
                    <th className="px-2 py-1">Count</th>
                    <th className="px-2 py-1">Cumulative</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    summary && Object.keys(summary).map(function(key, index) {
                      runningTotal+=summary[key]
                      const cumulative = (100*(runningTotal / totalWords)).toFixed(2)
                      return (
                        <tr className={parseInt(key)<=6 ? "bg-green-200" : "bg-red-200"}>
                          <td className="px-2 py-1">{key}</td>
                          <td className="px-2 py-1">{summary[key]}</td>
                          <td className="px-2 py-1">{cumulative}%</td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>

        }


      </main>


    </div>
  )
}
