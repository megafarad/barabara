import {DataProvider} from "./context/DataContext.tsx";
import {BrowserRouter, Route, Routes} from "react-router";
import {DashboardPage} from "./components/DashboardPage.tsx";
import {CreateDeckPage} from "./components/CreateDeckPage.tsx";
import {ViewDeckPage} from "./components/ViewDeckPage.tsx";
import {ReviewPage} from "./components/ReviewPage.tsx";
import Home from "./components/Home.tsx";


function App() {

    return (
        <DataProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />}/>
                    <Route path="/home" element={<Home />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/create-deck" element={<CreateDeckPage/>}/>
                    <Route path="/decks/:deckId" element={<ViewDeckPage/>}/>
                    <Route path="/decks/:deckId/study" element={<ReviewPage studyMode={true}/>}/>
                    <Route path="/decks/:deckId/review" element={<ReviewPage studyMode={false}/>}/>
                </Routes>
            </BrowserRouter>
        </DataProvider>
    )
}

export default App
