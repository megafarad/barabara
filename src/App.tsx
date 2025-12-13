import {DataProvider} from "./context/DataContext.tsx";
import {BrowserRouter, Route, Routes} from "react-router";
import {DashboardPage} from "./components/DashboardPage.tsx";
import {CreateDeckPage} from "./components/CreateDeckPage.tsx";
import {ViewDeckPage} from "./components/ViewDeckPage.tsx";
import {StudyPage} from "./components/StudyPage.tsx";
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
                    <Route path="/decks/:deckId/study" element={<StudyPage/>}/>
                </Routes>
            </BrowserRouter>
        </DataProvider>
    )
}

export default App
