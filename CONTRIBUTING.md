# Contributing

Thanks for your interest in contributing! 🎉

This project is a small, open-source, local-first flashcard app. The goal is to keep the codebase **approachable, hackable, and focused**, not to turn it into a giant everything-app.

If you’re reading this, you’re already doing more than most. ❤️

---

## Ways to contribute

You don’t have to write code to be helpful.

- **Bug reports**
    - UI glitches
    - Incorrect behavior (e.g., review flow acting weird)
    - LocalStorage / persistence issues

- **Feature suggestions**
    - Small, UX-focused improvements
    - Ideas that fit the “minimal, local-first” philosophy

- **Documentation**
    - Improving the README
    - Adding examples / screenshots
    - Clarifying comments in the code

- **Code**
    - Fixing bugs
    - Small quality-of-life improvements in the UI
    - Refactors that simplify the code (without adding a ton of new complexity)

If you’re not sure whether an idea fits, feel free to open a **discussion issue** first.

---

## Project philosophy (important!)

Before you dive in, a few guardrails:

- **Keep it small.** This is intentionally a *tiny* app. It’s okay if it doesn’t do everything Anki/Quizlet does.
- **Local-first mindset.** Right now, all data lives in the browser (`localStorage`). No backend, no accounts.
- **Approachable code.** Someone new should be able to read through the code in an evening and understand most of it.

Big features (accounts, multi-user, org management, full-blown sync, etc.) are **out of scope** for now; however, that may change in the future based upon demand. Ideally, I'd like to make this something that educational institutions use.

---

## Getting started (development setup)

1. **Fork** the repo and clone your fork:

   ```bash
   git clone https://github.com/megafarad/barabara.git
   cd barabara
    ````

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run the dev server**:

   ```bash
   npm run dev
   ```

4. Open the URL printed in the terminal (usually `http://localhost:5173`).

You should see the app, with decks/cards persisted in your browser’s `localStorage`.

---

## Project structure (high-level)

This may change over time, but roughly:

* `src/`

  * `App.tsx` – main application layout and top-level state wiring
  * `data/localDataStore.ts` – load/save logic for localStorage
  * `data/model.ts`– core data types (Deck, Card, AppState, etc.)
  * `components/` – UI components (deck list, card editor, study view, etc.)

All data is stored under a single `localStorage` key (e.g. `flashcards`).

---

## Issues & “good first issue”

* If you find a bug or have a small feature idea, please **open an issue** first.
* Look for labels like:

  * `good first issue` – great for getting started
  * `help wanted` – things that would be nice to have, but aren’t urgent

When opening an issue, try to include:

* What you expected to happen
* What actually happened
* Steps to reproduce (if it’s a bug)
* Any relevant browser/OS info

---

## Pull request guidelines

To keep things sane:

1. **One logical change per PR**

   * Small and focused PRs are much easier to review.
   * If you’re touching many unrelated things, consider splitting it.

2. **Discuss bigger changes first**

   * For anything non-trivial, please open an issue or comment on an existing one before doing a lot of work.

3. **Always create a new branch**

   * This makes it easier to keep your fork up-to-date with the main repo.

4. **Code style**

   * Use TypeScript where possible.
   * Keep components small and focused.
   * Prefer clarity over cleverness.
   * Please run linting before committing:

     ```bash
     npm run lint
     ```

4. **Tests**

   * At this stage, test coverage may be light.
   * If you add or change logic (e.g. spaced repetition scheduling), adding tests is a big plus.
   * If there’s no test setup for what you’re touching, you can mention that in the PR instead of inventing an entire test framework.

5. **PR description**

   * What you changed
   * Why you changed it
   * Any screenshots or GIFs for UI changes
   * Any breaking changes or migration notes (if applicable)

---

## Code of Conduct

Please be kind and respectful.

* Assume good faith.
* Give constructive feedback.
* No harassment, hate speech, or personal attacks.

If this project grows, we may adopt a more formal Code of Conduct (e.g. Contributor Covenant). For now, it boils down to: **don’t be a jerk.**

---

## Thank you

Open source lives and dies on the energy of people who show up and care.

Whether you’re filing a bug, fixing a typo, or building a feature:
**thank you** for taking the time to contribute. 🙏

