import {useParams} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import MyCrossword, {GuardianCrossword} from 'mycrossword';
import 'mycrossword/dist/index.css';
import useWebSocket from "react-use-websocket";
import {GuessGrid} from "mycrossword/dist/cjs/interfaces";
import {useDebounce} from "mycrossword/dist/cjs/hooks";

const teamId = 'team1'
const userId = 'user1'

interface Move {
    x: number,
    y: number,
    value: string
}

interface CrosswordProps {
    id: string,
    crosswordData: GuardianCrossword
}

const Crossword = ({id, crosswordData}: CrosswordProps) => {
    const {dimensions} = crosswordData
    const initialGuessGrid = Array(dimensions.rows).fill(Array(dimensions.cols).fill(''))
    const [answers, setAnswers] = useState<GuessGrid>({value: initialGuessGrid})
    const [key, setKey] = useState(0)
    const {
        sendMessage,
        lastMessage
    } = useWebSocket(`wss://cooperative-crosswords.onrender.com/move/${teamId}/${id}/${userId}`);

    const updateGrid = useCallback(({pos, guess}) =>
        sendMessage(JSON.stringify([{x: pos.col, y: pos.row, value: guess || ''}])
        ), [sendMessage])

    useEffect(() => {
        if (lastMessage !== null) {
            const moves: Move[] = JSON.parse(lastMessage.data)
            const initialAnswers = answers['value'].map(row => [...row])
            for (const move of moves) {
                initialAnswers[move.x][move.y] = move.value
            }
            setAnswers({value: initialAnswers})
        }
    }, [lastMessage, setAnswers]);

    const debouncedAnswers = useDebounce(answers, 1000)

    useEffect(() => {
        setKey((current) => current + 1)
    }, [debouncedAnswers])

    return (
        <div>
            <h1>{`${new Date(crosswordData.date).toDateString()}: No ${crosswordData.number}`}</h1>
            <h2>{`By ${crosswordData.creator.name}`}</h2>
            <MyCrossword id={id} key={key} data={crosswordData} onCellChange={updateGrid} loadGrid={answers}
                         theme={'deepOrange'}/>
        </div>
    )
}

const CrosswordWrapper = () => {
    const {id} = useParams()

    const [crosswordData, setCrosswordData] = useState<GuardianCrossword | undefined>(undefined)
    useEffect(() => {
        fetch(`https://cooperative-crosswords.onrender.com/crossword/${id}/guardian`)
            .then(response => response.json())
            .then(data => {
                setCrosswordData(data)
            })
    }, [])

    if (crosswordData === undefined) {
        return <div>Loading...</div>
    }
    return <Crossword id={id} crosswordData={crosswordData}/>
}

export default CrosswordWrapper
