import Layout from "./Layout.tsx";
import {Link, useNavigate} from "react-router";
import {useDataStore} from "../context/DataContext.tsx";
import {DecksTable} from "./DecksTable.tsx";

export const DashboardPage = () => {
    const navigate = useNavigate();
    const {decks} = useDataStore();

    return (
        <Layout onNavigate={(href) => navigate(href)}>
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
            {decks.length === 0 && (
                <div className="mt-6">
                    <div className="mt-6">
                        <p className="text-center text-slate-500">No decks yet! Create one by clicking the button below.</p>
                    </div>
                    <Link to='/create-deck'>
                        <button className="rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-2 text-sm font-semibold shadow-sm hover:translate-y-px focus:outline-none focus:ring-2 focus:ring-slate-400/50">
                            Create Deck
                        </button>
                    </Link>
                </div>
            )}
            {decks.length > 0 && (
                <div className="mt-6">
                    <DecksTable decks={decks}/>
                </div>
            )}
        </Layout>
    )
}
