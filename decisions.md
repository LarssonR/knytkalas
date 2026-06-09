# decisions.md — Logg över viktiga beslut och lösningar

---

**Datum:** 2026-06
**Problem:** `create-next-app` blockerades av att mappnamnet "Knytkalas" har stor bokstav, vilket npm inte tillåter som paketnamn.
**Lösning:** Skapade projektet manuellt — package.json med `"name": "knytkalas"` (lowercase) samt alla Next.js-konfigurationsfiler för hand.
**Anledning:** Enklare än att flytta filer från en temporär mapp. Ger också full kontroll över konfigurationen från start.

---

**Datum:** 2026-06
**Problem:** Ingen Supabase-inloggning — gäster måste identifieras utan konto.
**Lösning:** Gäster identifieras via namn + telefonnummer. Vid registrering kontrolleras om kombination event_id + phone redan finns — returnerar befintlig gäst istället för att skapa dubblett.
**Anledning:** Enkel UX utan lösenord/SMS-verifiering, som beskrivs i kravspecifikationen.

---

**Datum:** 2026-06
**Problem:** Behörighet styrs inte via Supabase Auth utan via tokens i URL.
**Lösning:** `admin_token` och `guest_token` är UUID:er som genereras automatiskt i databasen. Admin-åtgärder sker via `createServiceClient()` (service role) server-side. Gäster når data via `guest_token`.
**Anledning:** Matchar arkitekturbeslut i CLAUDE.md — ingen inloggning, tokens i URL styr åtkomst.

---
