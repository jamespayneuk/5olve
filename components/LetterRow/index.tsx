import { useEffect, useState } from "react"
import { Color } from "../../pages/api/word"

interface Props {
    initialLetters: string[];
    initialColors: Color[];
    onChange?: (letters: string[], colors: string[]) => void;
}

export default function LetterRow(props: Props) {
  const [ colours, setColours ] = useState<Color[]>(props.initialColors)

  const handleColourChange = (index) => {
    const newColours = [...colours]

    const currentColour = colours[index]
    if (currentColour == "gray" || !currentColour) {
      newColours[index] = "yellow"
    } else if (currentColour == "yellow") {
      newColours[index] = "green"
    } else if (currentColour == "green") {
      newColours[index] = "gray"
    }

    setColours(newColours)
  }

  const handleSubmit = () => {
    props.onChange?.(props.initialLetters, colours)
  }

  return (
    <div className='mt-4'>
      {props.initialLetters.map((l, i) =>
        <span
          key={i}
          onClick={() => props.onChange && handleColourChange(i)}
          className={`cursor-pointer select-none border rounded border-gray-500 p-2 w-8 uppercase ${colours[i] == "yellow" && "bg-orange-500"} ${colours[i] == "green" && "bg-green-500"}`}
        >
          {l}
        </span>
      )}
        {props.onChange ? (
          <div
            className="w-10 cursor-pointer inline ml-2 p-2 rounded bg-blue-500"
            onClick={handleSubmit}
          >
            {'>'}
          </div>
        ) : null}
    </div>
  )
}

