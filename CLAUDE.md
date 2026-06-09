# Projektinstruktioner för Claude

## Om projektet
- **Namn:** Knytkalas
- **Beskrivning:** En app där gäster via inbjudningslänk anmäler vad de tar med sig till ett knytkalas. Man anger rätt, måltid, kategori samt om det innehåller gluten eller laktos. Skaparen kan valfritt aktivera ekonomifunktion för att dela på notan i efterhand.
- **Målgrupp:** Privatpersoner som arrangerar knytkalas, t.ex. midsommar
- **Status:** Under utveckling
- **GitHub:** https://github.com/LarssonR/knytkalas

## Teknisk stack
- **Frontend:** Next.js (App Router), Tailwind CSS
- **Backend/Databas:** Supabase (PostgreSQL)
- **Hosting:** Vercel
- **Autentisering:** Ingen inloggning — gäster identifieras via namn + telefonnummer vid inbjudningslänk. Arrangören skapar evenemang och får en unik admin-länk.

## Kärnfunktioner

### Evenemang
- Arrangören skapar ett evenemang med namn, datum och plats
- Valfritt: aktivera ekonomifunktion (dela på notan)
- Arrangören får en unik admin-länk och en unik gästlänk att dela

### Inbjudningsflöde (gäst)
- Gästen öppnar inbjudningslänken
- Anger sitt **namn** och **telefonnummer** — detta blir deras identitet i evenemanget
- Inget konto behövs

### Rätter och kategorier
- Varje rätt tillhör en **måltid** och en **underkategori**
- Måltider: `Lunch`, `Middag`
- Underkategorier: `Förrätt`, `Huvudrätt`, `Efterrätt`
- Varje rätt har flaggor: `innehåller_gluten` (boolean), `innehåller_laktos` (boolean)
- En gäst kan lägga till flera rätter

### Ekonomi (valfritt per evenemang)
- Om aktiverat kan gäster ange vad de lagt ut för sin rätt (kostnad i SEK)
- I slutet kan arrangören se en sammanställning och beräkna hur man delar på notan
- Om ekonomi inte är aktiverat visas inga kostnadsfält alls

## Databasstruktur (Supabase)

```
events
  id, name, date, location, economy_enabled (bool), admin_token, guest_token, created_at

guests
  id, event_id, name, phone, created_at

dishes
  id, event_id, guest_id, name, meal (lunch|dinner), category (starter|main|dessert),
  contains_gluten (bool), contains_lactose (bool), cost_sek (nullable), created_at
```

- `admin_token` och `guest_token` är UUID:er som används i URL:er
- RLS ska vara aktiverat på alla tabeller
- Gäster kan bara se/skriva till evenemang de tillhör (via `guest_token`)
- Admin-åtgärder kräver `admin_token`

## URL-struktur
- `/` — Startsida, skapa nytt evenemang
- `/event/[guest_token]` — Gästvy: se vad som tas med, lägg till rätt
- `/admin/[admin_token]` — Adminvy: översikt, ekonomisammanställning, dela länk

## Arbetssätt
- Planera alltid innan du börjar koda — beskriv vad du ska göra och varför
- Gör en sak i taget, testa att det fungerar innan du går vidare
- Fråga om du är osäker istället för att gissa
- Skriv kommentarer på svenska i koden
- Håll koden enkel — undvik onödig komplexitet
- Efter varje buggfix eller viktig lösning, lägg till en kort notering i decisions.md

## Kodstil
- Tydlig och läsbar kod framför smart och kompakt
- Beskrivande variabelnamn på engelska
- Bryt upp stora funktioner i mindre delar
- Hantera alltid felfall — visa användaren ett vettigt felmeddelande på svenska

## Säkerhet och GDPR
- Appen samlar in namn och telefonnummer — behandla som personuppgifter
- Lagra aldrig känslig data i koden, använd miljövariabler
- Supabase RLS (Row Level Security) ska alltid vara aktiverat
- Logga aldrig personuppgifter
- Telefonnummer används endast för identifiering inom evenemanget — skickas inte vidare

## Vad Claude INTE ska göra
- Ändra saker som inte är relaterade till uppgiften
- Installera nya bibliotek utan att fråga först
- Skriva om fungerande kod utan anledning
- Anta att något fungerar utan att kontrollera

## Användare och behörigheter
- **Arrangör** (admin_token): Kan se allt, redigera evenemanget, se ekonomiöversikt
- **Gäst** (guest_token): Kan se evenemanget, lägga till och redigera sina egna rätter
- Ingen autentisering via Supabase Auth — behörighet styrs via token i URL

## Miljövariabler
Finns i `.env.local` (läggs ALDRIG upp på GitHub)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (används endast server-side)

## Kända begränsningar
- Ingen e-postbekräftelse eller SMS-verifiering — telefonnummer är självrapporterat
- Ingen möjlighet att återhämta admin-länk om den tappas bort (ännu)
- Inga push-notiser när nya rätter läggs till

---

## decisions.md — Logg över viktiga beslut och lösningar
*(Flytta detta till en egen fil decisions.md i projektet)*

### Mall för varje notering:
**Datum:** [ÅÅÅÅ-MM]
**Problem:** [Vad var problemet]
**Lösning:** [Hur löstes det]
**Anledning:** [Varför valde vi denna lösning]

---
*Denna fil ska uppdateras löpande när projektet utvecklas.*
