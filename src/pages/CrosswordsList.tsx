import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

interface CrosswordMetadata {
    id: string,
    seriesNo: string,
    date: number
}

const CrosswordsList = () => {
    const [crosswords, setCrosswords] = useState<CrosswordMetadata[]>([])
    useEffect(() => {
        fetch('https://cooperative-crosswords.onrender.com/crosswords')
            .then(response => response.json())
            .then((data: CrosswordMetadata[]) => {
                setCrosswords(data.sort((a, b) => b.date - a.date))
            })
    }, [])
    return (
        <div>
            <h1>Crosswords</h1>
            <ul>
                {crosswords.map(crossword => <li key={crossword.id}><Link to={`crossword/${crossword.id}`}>{crossword.seriesNo} {new Date(crossword.date).toDateString()}</Link>
                </li>)}
            </ul>
        </div>
    )
}

export default CrosswordsList
