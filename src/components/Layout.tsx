import React, {useEffect, useState} from "react";
import {useDataStore} from "../context/DataContext.tsx";
import {dataStore} from "../data/localDataStore.ts";


export interface Link {
    key: string;
    label: string;
    href: string;
}

export default function Layout({
                                   children,
                                   active,
                                   onNavigate,
                               }: {
    children: React.ReactNode;
    /** Name of the active nav item */
    active?: string;
    /** Called when a nav link is clicked. If omitted, anchors will navigate via href. */
    onNavigate?: (href: string, key: string) => void;
    /** Optional override for links */
}) {
    const [open, setOpen] = useState(false);
    const {decks, setDecks} = useDataStore();

    const links: Link[] = decks.map((deck) => ({
        key: deck.id,
        label: deck.name,
        href: `/decks/${deck.id}`,
    }));

    links.push({
        key: "create",
        label: "Create Deck",
        href: "/create-deck",
    });

    useEffect(() => {
        let mounted = true;

        (async () => {
            const decks = await dataStore.getDecks();
            if (mounted) {
                setDecks(decks);
            }
        })();
        return () => {
            mounted = false;
        }
    }, [setDecks]);

    function handleNavClick(e: React.MouseEvent, href: string, key: string) {
        if (onNavigate) {
            e.preventDefault();
            onNavigate(href, key);
            setOpen(false);
        }
    }

    return (
        <div
            className="min-h-screen w-full bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-100 flex flex-col">
            {/* Top bar */}
            <header
                className="sticky top-0 z-40 backdrop-blur supports-backdrop-filter:bg-white/60 dark:supports-backdrop-filter:bg-slate-900/50 bg-white/90 dark:bg-slate-900/70 border-b border-slate-200/60 dark:border-slate-800">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="h-14 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                className="md:hidden inline-flex items-center justify-center rounded-xl p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400/50"
                                aria-label={open ? "Close menu" : "Open menu"}
                                aria-expanded={open}
                                onClick={() => setOpen((s) => !s)}
                            >
                                {/* Hamburger / Close */}
                                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                                    {open ? (
                                        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2"
                                              strokeLinecap="round"/>
                                    ) : (
                                        <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2"
                                              strokeLinecap="round"/>
                                    )}
                                </svg>
                            </button>
                            <a href="/" className="flex items-center gap-2">
                                <div
                                    className="h-9 w-28 rounded-2xl bg-slate-900 dark:bg-white flex items-center justify-center shadow-sm">
                                    <span className="text-white dark:text-slate-900 font-bold">BaraBara</span>
                                </div>
                            </a>
                        </div>

                    </div>
                </div>
            </header>

            <div className="px-4 flex-1 flex flex-col">
                {/* Two-column layout with left sidebar */}
                <div className="py-6 flex flex-col md:flex-row gap-6 flex-1">
                    {/* Sidebar (left) */}
                    <aside className={(open ? "block" : "hidden") + " md:block md:w-60 md:shrink-0"}>
                        <nav aria-label="Main"
                             className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur p-3 shadow-sm h-full md:sticky md:top-20 md:max-h-[calc(100vh-6rem)] md:overflow-auto">
                            <ul className="space-y-1">
                                {links.map((item) => {
                                    const isActive = active ? active === item.key : false;
                                    return (
                                        <li key={item.key}>
                                            <a
                                                href={item.href}
                                                onClick={(e) => handleNavClick(e, item.href, item.key)}
                                                className={
                                                    "group flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm transition " +
                                                    (isActive
                                                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                                                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800")
                                                }
                                                aria-current={isActive ? "page" : undefined}
                                            >
                                                    <span className="inline-flex items-center gap-2">
                                                        <NavIcon name={item.key} active={isActive}/>
                                                        {item.label}
                                                    </span>
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>
                    </aside>

                    {/* Main content (right) */}
                    <main className="min-h-[60vh] w-full flex-1 flex flex-col">
                        <div
                            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur p-6 shadow-sm flex-1">
                            {children}
                        </div>
                    </main>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-6 text-center text-xs text-slate-400">
                © {new Date().getFullYear()} Megafarad
            </footer>
        </div>
    );
}

function NavIcon({name, active}: { name: string; active: boolean }) {
    const cls = active ? "text-current" : "text-slate-500 group-hover:text-slate-700 dark:group-hover:text-white";
    if (name === "create") {
        return (
            <svg viewBox="0 0 24 24" className={"h-4 w-4 " + cls} aria-hidden>
                <path
                    d="M20.71,3.29a2.91,2.91,0,0,0-2.2-.84,3.25,3.25,0,0,0-2.17,1L9.46,10.29s0,0,0,0a.62.62,0,0,0-.11.17,1,1,0,0,0-.1.18l0,0L8,14.72A1,1,0,0,0,9,16a.9.9,0,0,0,.28,0l4-1.17,0,0,.18-.1a.62.62,0,0,0,.17-.11l0,0,6.87-6.88a3.25,3.25,0,0,0,1-2.17A2.91,2.91,0,0,0,20.71,3.29Z"
                    fill="currentColor"></path>
                <path
                    d="M20,22H4a2,2,0,0,1-2-2V4A2,2,0,0,1,4,2h8a1,1,0,0,1,0,2H4V20H20V12a1,1,0,0,1,2,0v8A2,2,0,0,1,20,22Z"
                    fill="currentColor"></path>
            </svg>
        )
    } else {
        return (
            <svg viewBox={"0 0 24 24"} className={"h-4 w-4 " + cls} aria-hidden>
                <path
                    d="M2.75458 14.716L3.27222 16.6479C3.87647 18.9029 4.17859 20.0305 4.86351 20.7618C5.40432 21.3392 6.10421 21.7433 6.87466 21.9229C7.85044 22.1504 8.97798 21.8483 11.2331 21.244C13.4881 20.6398 14.6157 20.3377 15.347 19.6528C15.4077 19.5959 15.4664 19.5373 15.5233 19.477C15.1891 19.449 14.852 19.3952 14.5094 19.3271C13.8133 19.1887 12.9862 18.967 12.008 18.7049L11.9012 18.6763L11.8764 18.6697C10.8121 18.3845 9.92281 18.1457 9.21277 17.8892C8.46607 17.6195 7.7876 17.287 7.21148 16.7474C6.41753 16.0038 5.86193 15.0414 5.61491 13.982C5.43567 13.2133 5.48691 12.4594 5.62666 11.6779C5.76058 10.929 6.00109 10.0315 6.28926 8.95613L6.28926 8.95611L6.82365 6.96174L6.84245 6.8916C4.9219 7.40896 3.91101 7.71505 3.23687 8.34646C2.65945 8.88726 2.25537 9.58715 2.07573 10.3576C1.84821 11.3334 2.15033 12.4609 2.75458 14.716Z"
                    fill="currentColor"/>
                <path fillRule="evenodd" clipRule="evenodd"
                      d="M20.8293 10.7154L20.3116 12.6473C19.7074 14.9024 19.4052 16.0299 18.7203 16.7612C18.1795 17.3386 17.4796 17.7427 16.7092 17.9223C16.6129 17.9448 16.5152 17.9621 16.415 17.9744C15.4999 18.0873 14.3834 17.7881 12.3508 17.2435C10.0957 16.6392 8.96815 16.3371 8.23687 15.6522C7.65945 15.1114 7.25537 14.4115 7.07573 13.641C6.84821 12.6652 7.15033 11.5377 7.75458 9.28263L8.27222 7.35077C8.3591 7.02654 8.43979 6.7254 8.51621 6.44561C8.97128 4.77957 9.27709 3.86298 9.86351 3.23687C10.4043 2.65945 11.1042 2.25537 11.8747 2.07573C12.8504 1.84821 13.978 2.15033 16.2331 2.75458C18.4881 3.35883 19.6157 3.66095 20.347 4.34587C20.9244 4.88668 21.3285 5.58657 21.5081 6.35703C21.7356 7.3328 21.4335 8.46034 20.8293 10.7154ZM11.0524 9.80589C11.1596 9.40579 11.5709 9.16835 11.971 9.27556L16.8006 10.5697C17.2007 10.6769 17.4381 11.0881 17.3309 11.4882C17.2237 11.8883 16.8125 12.1257 16.4124 12.0185L11.5827 10.7244C11.1826 10.6172 10.9452 10.206 11.0524 9.80589ZM10.2756 12.7033C10.3828 12.3032 10.794 12.0658 11.1941 12.173L14.0919 12.9495C14.492 13.0567 14.7294 13.4679 14.6222 13.868C14.515 14.2681 14.1038 14.5056 13.7037 14.3984L10.8059 13.6219C10.4058 13.5147 10.1683 13.1034 10.2756 12.7033Z"
                      fill="currentColor"/>
            </svg>)
    }

}
