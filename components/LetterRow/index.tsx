import { useEffect, useState } from "react"
import { Color } from "../../pages/api/word"

interface Props {
    initialLetters: string[];
    initialColors: Color[];
    onChange?: (letters: string[], colors: string[]) => void;
    disableArrow?: boolean;
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
          className={`cursor-pointer select-none border rounded border-gray-500 p-2 min-w-[35px] inline-block text-center uppercase ${colours[i] == "yellow" && "bg-yellow-400"} ${colours[i] == "green" && "bg-green-500"}`}
        >
          {l}
        </span>
      )}
        {props.onChange && !props.disableArrow ? (
          <div
            className="inline w-10 p-2 ml-2 bg-blue-500 rounded cursor-pointer"
            onClick={handleSubmit}
          >
            {'>'}
          </div>
        ) : null}
    </div>
  )
}

