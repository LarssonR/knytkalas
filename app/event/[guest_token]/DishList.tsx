"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Dish, Guest } from "@/lib/database.types";

interface Props {
  dishes: Dish[];
  guests: Guest[];
  currentGuestId?: string;
  guestToken: string;
  economyEnabled: boolean;
  mealLabels: Record<string, string>;
  categoryLabels: Record<string, string>;
  deleteDish: (dishId: string, guestToken: string) => Promise<void>;
}

const mealOrder = ["lunch", "dinner"];
const categoryOrder = ["starter", "main", "dessert"];

export function DishList({
  dishes,
  guests,
  currentGuestId,
  guestToken,
  economyEnabled,
  mealLabels,
  categoryLabels,
  deleteDish,
}: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  const guestMap = Object.fromEntries(guests.map((g) => [g.id, g.name]));

  async function handleDelete(dishId: string) {
    setDeleting(dishId);
    try {
      await deleteDish(dishId, guestToken);
      router.refresh();
    } finally {
      setDeleting(null);
    }
  }

  if (dishes.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        Inga rätter har lagts till än.
      </div>
    );
  }

  // Gruppera per måltid och kategori
  const grouped: Record<string, Record<string, Dish[]>> = {};
  for (const dish of dishes) {
    if (!grouped[dish.meal]) grouped[dish.meal] = {};
    if (!grouped[dish.meal][dish.category])
      grouped[dish.meal][dish.category] = [];
    grouped[dish.meal][dish.category].push(dish);
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-700">Vad tas med?</h2>

      {mealOrder
        .filter((meal) => grouped[meal])
        .map((meal) => (
          <div key={meal}>
            <h3 className="text-lg font-semibold text-amber-600 mb-3">
              {mealLabels[meal]}
            </h3>

            {categoryOrder
              .filter((cat) => grouped[meal]?.[cat])
              .map((cat) => (
                <div key={cat} className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    {categoryLabels[cat]}
                  </h4>

                  <div className="space-y-2">
                    {grouped[meal][cat].map((dish) => (
                      <div
                        key={dish.id}
                        className="bg-white rounded-xl shadow-sm p-4 flex items-start justify-between gap-2"
                      >
                        <div>
                          <p className="font-medium text-gray-800">
                            {dish.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {guestMap[dish.guest_id] ?? "Okänd gäst"}
                          </p>

                          <div className="flex gap-2 mt-1">
                            {dish.contains_gluten && (
                              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                                Gluten
                              </span>
                            )}
                            {dish.contains_lactose && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                Laktos
                              </span>
                            )}
                          </div>

                          {economyEnabled && dish.cost_sek !== null && (
                            <p className="text-sm text-gray-500 mt-1">
                              {dish.cost_sek} kr
                            </p>
                          )}
                        </div>

                        {/* Ta bort-knapp visas bara för gästens egna rätter */}
                        {dish.guest_id === currentGuestId && (
                          <button
                            onClick={() => handleDelete(dish.id)}
                            disabled={deleting === dish.id}
                            className="text-sm text-red-400 hover:text-red-600 transition-colors shrink-0"
                          >
                            {deleting === dish.id ? "..." : "Ta bort"}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ))}
    </div>
  );
}
