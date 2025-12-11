import type {Deck} from "../data/model.ts";
import {useEffect, useState} from "react";
import {dataStore} from "../data/localDataStore.ts";
import {DateTime} from "luxon";
import {Link} from "react-router";

interface DecksTableProps {
    decks: Deck[];
}

export function DecksTable({decks}: DecksTableProps) {

    return (
        <table className="table-fixed w-full">
            <thead>
            <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Cards Due for Review</th>
                <th className="px-4 py-2">Actions</th>
            </tr>
            </thead>
            <tbody>
            {decks.map((deck) => {
                return (
                    <DeckRow key={deck.id} deck={deck}/>
                )
            })}
            </tbody>
        </table>
    )

}

function DeckRow({deck}: { deck: Deck }) {
    const [numberOfCardsToStudy, setNumberOfCardsToStudy] = useState(0);

    useEffect(() => {
        dataStore.getCards(deck.id).then(cards => {
            const cardsToStudy = cards.filter(card => DateTime.fromISO(card.nextReviewAt).diffNow('days').days <= 0);
            setNumberOfCardsToStudy(cardsToStudy.length);
        });
    }, [deck.id]);

    return (
        <tr>
            <td className="border px-4 py-2 truncate">{deck.name}</td>
            <td className="border px-4 py-2 truncate">{numberOfCardsToStudy}</td>
            <td className="border px-4 py-2 flex items-center justify-center gap-2">
                {((numberOfCardsToStudy > 0) && (
                    <Link to={`/decks/${deck.id}/study`}>
                        <button
                            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 px-3 py-2 text-sm shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400/50">
                            Study
                        </button>
                    </Link>
                ))}
                <Link to={`/decks/${deck.id}`}>
                    <button
                        className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 px-3 py-2 text-sm shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400/50">
                        View
                    </button>
                </Link>
            </td>
        </tr>
    )
}
