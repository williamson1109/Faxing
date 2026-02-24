# ⚔ Faxing Championship

A medieval-themed web app for running a **Faxing** contest — the noble art of consuming one full litre of Faxe Extra Strong Beer (10% ABV) within the hour.

---

## The Rules

| Title | Condition |
|---|---|
| 👑 **Faxekonge** | The first **male** to finish |
| 👑 **Faxedronning** | The first **female** to finish |
| ⚔ **Faxeridder** | Any subsequent finisher before the hour is up |
| 🐴 **Hestemann** | Did not finish within the hour |

> *Drink responsibly. Know your limits.*

---

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## How to Run a Contest

1. **Enlist warriors** — Enter each participant's name and gender, then click **+ Enlist**
2. **Start** — Click **⚔ Begin the Contest ⚔** to start the 1-hour countdown
3. **Track** — As participants finish their can, hit **🍺 Finished!** on their card
4. **DNF** — If someone gives up, hit **✕ DNF** to mark them as Hestemann immediately
5. **Search** — Use the search bar to quickly find a specific warrior if the field is large
6. **Reset** — Click **↩ New Contest** to start over

---

## Tech Stack

- [React 18](https://react.dev/)
- [Vite 6](https://vitejs.dev/)
- Vanilla CSS with medieval styling inspired by the Faxe Brewery Denmark aesthetic

---

## Project Structure

```
src/
├── App.jsx                  # Root component & contest state
├── App.css                  # All styles
├── index.css                # Global / body styles
└── components/
    ├── Registration.jsx     # Enlist warriors before the contest
    ├── Arena.jsx            # Live contest view with leaderboard
    ├── ContestantCard.jsx   # Individual warrior card
    └── GlobalTimer.jsx      # Countdown timer with progress bar
```
