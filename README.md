# ⚔ Faxing-Mesterskapet

Eet Gammelnordisk Webbe-Verktøy for afviklingen af en **Faxing**-Turnering — den ædle Kunst at fortære een hel Litre Faxe Extra Strong (10% Styrke) inden Timens Udløb.

---

## Reglerne

| Titel | Betingelse |
|---|---|
| 👑 **Faxekonge** | Den første **Herre** som fuldbrager det |
| 👑 **Faxedronning** | Den første **Dame** som fuldbrager det |
| ⚔ **Faxeridder** | Enhver øvrig Kriger som fuldbrager det inden Timen |
| 🐴 **Hestemann** | Fuldbragde det Ei inden Timens Udløb |

> *Drikk med Maadehold. Kjennd Eders Grændser.*

---

## Kom i Gang

```bash
npm install
npm run dev
```

Aabne saa [http://localhost:5173](http://localhost:5173) i Eders Webbe-Leser.

---

## Hvorledes man afvikler en Turnering

1. **Innskriv Krigere** — Skriv ind Navn og Kjøn for hver Deltager, og tryk **+ Innskriv**
2. **Begyn** — Tryk **⚔ Begyn Kampen ⚔** for at starte den ene Times Nedtælling
3. **Følg med** — Naar en Kriger tømmer sit Bæger, tryk **🍺 Fuldbragt!** paa hans Kort
4. **Gav Op** — Dersom nogen overgiver sig, tryk **✕ Gav Op** for straks at udnævne dem til Hestemann
5. **Søk** — Brug Søgefeltet til hurtig at finde en bestemt Kriger naar Flokken er stor
6. **Ny Turnering** — Tryk **↩ Ny Turnering** for at begynde forfra

---

## Teknik

- [React 18](https://react.dev/)
- [Vite 6](https://vitejs.dev/)
- Simpel CSS med Middelalder-Stil inspireret af Faxe Bryggeri Danmarks Æstetik

---

## Projektstruktur

```
src/
├── App.jsx                  # Hoved-Komponent og Turnerings-Tilstand
├── App.css                  # Al Stilsætning
├── index.css                # Globale Stile
└── components/
    ├── Registration.jsx     # Innskriv Krigere før Kampen
    ├── Arena.jsx            # Live Kamp-Visning med Rangliste
    ├── ContestantCard.jsx   # Den enkelte Krigers Kort
    └── GlobalTimer.jsx      # Nedtælling med Fremgangsbjælke
```
