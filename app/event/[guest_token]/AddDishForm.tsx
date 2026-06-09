"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  guestId: string;
  guestToken: string;
  economyEnabled: boolean;
  addDish: (formData: FormData, guestToken: string) => Promise<void>;
}

export function AddDishForm({ guestId, guestToken, economyEnabled, addDish }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("guest_id", guestId);

    try {
      await addDish(formData, guestToken);
      setOpen(false);
      (e.target as HTMLFormElement).reset();
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Något gick fel.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-6">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          + Lägg till rätt
        </button>
      ) : (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Lägg till en rätt
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Rättens namn
              </label>
              <input
                type="text"
                name="dish_name"
                required
                placeholder="T.ex. Janssons frestelse"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Måltid
                </label>
                <select
                  name="meal"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Middag</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Kategori
                </label>
                <select
                  name="category"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="starter">Förrätt</option>
                  <option value="main">Huvudrätt</option>
                  <option value="dessert">Efterrätt</option>
                </select>
              </div>
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" name="contains_gluten" className="w-4 h-4" />
                Innehåller gluten
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" name="contains_lactose" className="w-4 h-4" />
                Innehåller laktos
              </label>
            </div>

            {economyEnabled && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Kostnad (SEK)
                </label>
                <input
                  type="number"
                  name="cost_sek"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 border border-gray-300 text-gray-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Avbryt
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                {loading ? "Lägger till..." : "Lägg till"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
