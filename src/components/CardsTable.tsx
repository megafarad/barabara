import type {Card} from "../data/model.ts";

interface CardsTableProps {
    cards: Card[];
    onEdit: (card: Card) => void;
    onDelete: (card: Card) => void;
}

export function CardsTable({cards, onEdit, onDelete}: CardsTableProps) {
    return (
        <table className="table-fixed w-full">
            <thead>
            <tr>
                <th className="px-4 py-2">Front</th>
                <th className="px-4 py-2">Back</th>
                <th className="px-4 py-2">Actions</th>
            </tr>
            </thead>
            <tbody>
            {cards.map((card) => {
                return (
                    <tr key={card.id}>
                        <td className="border px-4 py-2 truncate">{card.front}</td>
                        <td className="border px-4 py-2 truncate">{card.back}</td>
                        <td className="border px-4 py-2 flex items-center justify-center gap-2">
                            <button onClick={() => onEdit(card)}
                                    className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 px-3 py-2 text-sm shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400/50">
                                Edit
                            </button>
                            <button onClick={() => onDelete(card)}
                                    className="ml-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 px-3 py-2 text-sm shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400/50">
                                Delete
                            </button>
                        </td>
                    </tr>
                )
            })}
            </tbody>
        </table>
    )

}
