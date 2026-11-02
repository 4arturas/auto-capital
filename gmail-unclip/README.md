# Gmail Trimless

Chrome plėtinys, kuris automatiškai išplečia nupjautą / „trimmed" el. laiškų turinį Gmail'e be jokio vartotojo veiksmo.

## Kaip įdiegti ir išbandyti

1. Atidarykite Chrome naršyklėje adresą:

   ```
   chrome://extensions/
   ```

2. Dešinėje viršuje įjunkite **Developer mode** (Kūrėjo režimas) per slinkiklį.

3. Paspauskite mygtuką **Load unpacked** (Įkelti nesurinktą plėtinį).

4. Pasirinkite šio projekto aplanką (`gmail-unclip/`).

5. Plėtinys pasirodys sąraše ir veiks automatiškai atidarius bet kurį Gmail laišką.

## Kaip patikrinti, kad veikia

- Atidarykite Gmail (`https://mail.google.com`) ir atidarykite laišką, kuriame yra nupjauto turinio.
- Atidarykite naršyklės konsolę (`F12` → Console) ir ieškokite žinučių, prasidedančių nuo `[Gmail Trimless]`.
- Paspauskite plėtinio ikoną viršutiniame dešiniajame kampe — matysite „🟢 Active / Aktyvus".

## Failai

| Failas | Aprašymas |
|---|---|
| `manifest.json` | Plėtinio konfigūracija (Manifest V3) |
| `content.js` | Skriptas, kuris stebi DOM ir automatiškai spaudžia „Show trimmed content" |
| `popup.html` | Plėtinio langelis su būsenos indikatoriumi |
| `README.md` | Šis failas |
