import { useEffect, useState } from "react"

export default function LetterRow(props) {
  const [ letters, setLetters ] = useState([,,,,])
  const [ colours, setColours ] = useState([,,,,])
  const [ instruction, setInstruction ] = useState()

  useEffect(() => {
    if (props.startLetters){
      setLetters(props.startLetters)
    }
  })

  const handleColourChange = (index) => {
    const newColours = [...colours]

    const currentColour = colours[index]
    if (currentColour == "white" || !currentColour) {
      newColours[index] = "orange"
    } else if (currentColour == "orange") {
      newColours[index] = "green"
    } else if (currentColour == "green") {
      newColours[index] = "white"
    }

    setColours(newColours)
  }

  const handleSubmit = () => {
    props.onChange(letters, colours, props.rowIndex)
  }

  return (
    <div>
      {[...Array(5)].map((row, i) =>
        <span
          key={i}
          onClick={e => handleColourChange(i)}
          className={`border rounded border-gray-500 p-2 w-8 uppercase ${colours[i] == "orange" && "bg-orange-500"} ${colours[i] == "green" && "bg-green-500"}`}
          maxLength={1}
        >
          {letters[i]}
        </span>
      )}

        <div
          className="w-10 cursor-pointer inline ml-2 p-2 rounded bg-blue-500"
          onClick={handleSubmit}
        >
          >
        </div>
    </div>
  )
}

