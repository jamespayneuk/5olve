import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import LetterRow from '../components/LetterRow'
import { useEffect, useState } from 'react'
import { Entry } from './api/word'

async function getNextWord(req: Entry[][]): Promise<[string,string[]]> {
  const res = await fetch("/api/word", {method: "POST", body: JSON.stringify({words: req})})
  const json = await res.json();
  return [json.word, json.remainingWords];
}

export default function Home() {
  const [guesses, setGuesses] = useState<Entry[][]>([]);
  const [nextLetters, setNextLetters] = useState<string>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [remainingPossibleWords, setRemainingPossibleWords] = useState<string[]>()

  async function getWord(guesses: Entry[][]) {
    setLoading(true);
    const [word, remainingWords] = await getNextWord(guesses);
    setNextLetters(word);
    setRemainingPossibleWords(remainingWords)
    setLoading(false);
  }

  useEffect(() => {
    getWord([]);
  }, [])

  const handleRowChange = (letters: string[], colours) => {
    const row = letters.map((r,i) => {
      return {
        "letter": r,
        "color": colours[i] || "gray"
      }
    })

    setGuesses(g => [...g, row]);
    getWord([...guesses, row]);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>5olve</title>
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

        {guesses.map(guess => (
          <LetterRow
            key={guess.map(g => g.letter).join()}
            initialLetters={guess.map(g => g.letter)}
            initialColors={guess.map(g => g.color)}
          />
        ))}

        {
          nextLetters == "unknown"
            ?
          <>
            <div className="mt-4">There are no words that match this combination</div>
            <Image
              src="/Lewin.JPG"
              width="450"
              height="300"
              alt="No words"
            />
          </>
          :
            <>
              {remainingPossibleWords && remainingPossibleWords.length > 1 && <div className="mt-16">Type in the letters below then click on the letters to change the colours</div>}
              {remainingPossibleWords && remainingPossibleWords.length > 10 && <div className="mt-4 italic">Possible Words: {remainingPossibleWords.length}</div>}
              {remainingPossibleWords && remainingPossibleWords.length <= 10 && remainingPossibleWords.length > 1 && <div className="mt-4 italic">Possible Words: {remainingPossibleWords. join(",")}</div>}
              {(remainingPossibleWords && remainingPossibleWords.length == 1) ?
                <>
                  <div className="mt-4">The word IS:</div>
                  {loading || nextLetters === null ? (
                    <div>loading</div>
                  ) : (
                    <LetterRow
                      onChange={handleRowChange}
                      initialLetters={Array.from(nextLetters)}
                      initialColors={[...Array(5)].map(() => "gray")}
                      disableArrow={true}
                    />
                  )}
                </>
                :
                <>
                  <div className="mb-4">This is the next set of letters</div>
                  {loading || nextLetters === null ? (
                    <div>loading</div>
                  ) : (
                    <LetterRow
                      onChange={handleRowChange}
                      initialLetters={Array.from(nextLetters)}
                      initialColors={[...Array(5)].map(() => "gray")}
                      disableArrow={false}
                    />
                  )}
                </>
              }

            </>
        }
      </main>


    </div>
  )
}
