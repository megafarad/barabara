import React, {createContext, useContext, useState} from "react";
import type {Deck} from "../data/model.ts";

interface DataContextType {
    decks: Deck[];
    setDecks: (decks: Deck[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
    children: React.ReactNode;
}

export const DataProvider = ({children}: DataProviderProps) => {
    const [decks, setDecks] = useState<Deck[]>([]);

    const contextValue: DataContextType = {
        decks,
        setDecks,
    };

    return (
        <DataContext.Provider value={contextValue}>
            {children}
        </DataContext.Provider>)
}

// eslint-disable-next-line react-refresh/only-export-components
export const useDataStore = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("useDataStore must be used within a DataProvider");
    }
    return context;
}
