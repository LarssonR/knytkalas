import { createEvent } from "./actions";
import { redirect } from "next/navigation";

async function handleCreate(formData: FormData) {
  "use server";
  const event = await createEvent(formData);
  redirect(`/admin/${event.admin_token}`);
}

export default function HomePage() {
  return (
    <div>
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-amber-700 mb-2">🍽 Knytkalas</h1>
        <p className="text-gray-600">
          Planera vem som tar med vad — enkelt och smidigt.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Skapa nytt evenemang
        </h2>

        <form action={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Evenemangets namn
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="T.ex. Midsommarfest hos Lena"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Datum
            </label>
            <input
              type="date"
              name="date"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Plats
            </label>
            <input
              type="text"
              name="location"
              required
              placeholder="T.ex. Stugvägen 4, Dalarna"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="economy_enabled"
              id="economy_enabled"
              className="w-4 h-4 text-amber-500 rounded"
            />
            <label htmlFor="economy_enabled" className="text-sm text-gray-600">
              Aktivera ekonomifunktion (dela på notan i efterhand)
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Skapa evenemang
          </button>
        </form>
      </div>
    </div>
  );
}
