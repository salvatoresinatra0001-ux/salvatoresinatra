# Digital Identity Atlas V500.1 — Add-on di produzione

- Sito principale esistente: Atlas 3.0, non sostituito.
- Percorso aggiuntivo: `/identity-atlas-v500/`.
- URL canonico progettato: `https://www.salvatoresinatra.it/identity-atlas-v500/`.
- Link di accesso aggiunto alla navigazione della homepage.
- URL aggiunto al sitemap XML della produzione.
- Asset locali: `atlas.css`, `atlas.js`, `portrait.jpg`; nessuna dipendenza di build.
- Head SEO con canonical, robots, Open Graph, Twitter Card e Schema.org.
- La route ha una regola CSP dedicata che mantiene script e fogli di stile locali; autorizza solo l'host dei favicon e il frame CDN già utilizzato dal contenuto originale.
- Immagini: ritratto autentico riutilizzato dalla release V500; nessuna immagine generata o inventata.
- I due siti italiani dedicati alle band sono presentati come progetti editoriali distinti dalle rispettive fonti internazionali.

## Verifiche

La sorgente GitHub e lo stato del deploy Netlify sono verificabili; la raggiungibilità end-to-end del sottodominio `www` e TLS va confermata con un test HTTP pubblico/DNS, perché i controlli pubblici automatici non hanno restituito una risposta in questa sessione. La URL canonica è allineata al dominio già indicato nel sitemap e nei metadati della homepage, senza modificare DNS o redirect.
