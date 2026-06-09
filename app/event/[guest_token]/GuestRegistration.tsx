"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Guest } from "@/lib/database.types";

interface Props {
  eventId: string;
  guestToken: string;
  registerGuest: (eventId: string, name: string, phone: string) => Promise<Guest>;
}

export function GuestRegistration({ eventId, guestToken, registerGuest }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;

    try {
      const guest = await registerGuest(eventId, name, phone);
      router.replace(`/event/${guestToken}?guest_id=${guest.id}`);
    } catch {
      setError("Något gick fel. Försök igen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-1 text-gray-700">Välkommen!</h2>
      <p className="text-sm text-gray-500 mb-4">
        Ange ditt namn och telefonnummer för att anmäla dig till knytkalasät.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Ditt namn
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="Förnamn Efternamn"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Telefonnummer
          </label>
          <input
            type="tel"
            name="phone"
            required
            placeholder="070-123 45 67"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          {loading ? "Registrerar..." : "Gå in i evenemanget"}
        </button>
      </form>
    </div>
  );
}
