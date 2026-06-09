"use client";

import type { Guest, Dish } from "@/lib/database.types";

interface Props {
  guests: Guest[];
  dishes: Dish[];
}

export function EconomySummary({ guests, dishes }: Props) {
  const guestMap = Object.fromEntries(guests.map((g) => [g.id, g.name]));

  // Beräkna totalkostnad per gäst
  const costPerGuest: Record<string, number> = {};
  for (const dish of dishes) {
    if (dish.cost_sek !== null) {
      costPerGuest[dish.guest_id] =
        (costPerGuest[dish.guest_id] ?? 0) + dish.cost_sek;
    }
  }

  const totalCost = Object.values(costPerGuest).reduce((a, b) => a + b, 0);
  const numGuests = guests.length;
  const perPerson = numGuests > 0 ? totalCost / numGuests : 0;

  const settlements: { name: string; amount: number }[] = guests.map((g) => ({
    name: guestMap[g.id],
    amount: perPerson - (costPerGuest[g.id] ?? 0),
  }));

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Ekonomisammanställning
      </h2>

      <div className="grid grid-cols-3 gap-4 mb-6 text-center">
        <div>
          <p className="text-2xl font-bold text-amber-600">
            {totalCost.toFixed(0)} kr
          </p>
          <p className="text-xs text-gray-500">totalt utlagt</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-amber-600">{numGuests}</p>
          <p className="text-xs text-gray-500">gäster</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-amber-600">
            {perPerson.toFixed(0)} kr
          </p>
          <p className="text-xs text-gray-500">per person</p>
        </div>
      </div>

      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Vem betalar till vem?
      </h3>

      <div className="space-y-2">
        {settlements.map(({ name, amount }) => (
          <div key={name} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
            <span className="text-gray-700">{name}</span>
            {amount > 0 ? (
              <span className="text-red-500 font-medium">
                betalar {amount.toFixed(0)} kr
              </span>
            ) : amount < 0 ? (
              <span className="text-green-600 font-medium">
                får tillbaka {Math.abs(amount).toFixed(0)} kr
              </span>
            ) : (
              <span className="text-gray-400 text-sm">kvitt</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
