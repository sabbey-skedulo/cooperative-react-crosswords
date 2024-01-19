import './App.css'

import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import CrosswordsList from "./pages/CrosswordsList";
import Crossword from "./pages/Crossword";

const router = createBrowserRouter([
        {
            path: '/',
            element: <CrosswordsList/>
        },
        {
            path: '/crossword/:id',
            element: <Crossword/>
        },
    ]
);

function App() {
    return (
        <>
            <RouterProvider router={router}/>
        </>
    )
}

export default App
