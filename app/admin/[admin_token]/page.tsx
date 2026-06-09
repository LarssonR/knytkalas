import { notFound } from "next/navigation";
import { getEventByAdminToken } from "@/app/actions";
import { ShareLink } from "./ShareLink";
import { EconomySummary } from "./EconomySummary";
import type { Dish } from "@/lib/database.types";

interface Props {
  params: Promise<{ admin_token: string }>;
}

const mealLabels: Record<string, string> = { lunch: "Lunch", dinner: "Middag" };
const categoryLabels: Record<string, string> = {
  starter: "Förrätt",
  main: "Huvudrätt",
  dessert: "Efterrätt",
};
const mealOrder = ["lunch", "dinner"];
const categoryOrder = ["starter", "main", "dessert"];

export default async function AdminPage({ params }: Props) {
  const { admin_token } = await params;
  const data = await getEventByAdminToken(admin_token);

  if (!data) notFound();

  const { event, guests, dishes } = data;

  const guestMap = Object.fromEntries(guests.map((g) => [g.id, g.name]));

  const grouped: Record<string, Record<string, Dish[]>> = {};
  for (const dish of dishes) {
    if (!grouped[dish.meal]) grouped[dish.meal] = {};
    if (!grouped[dish.meal][dish.category]) grouped[dish.meal][dish.category] = [];
    grouped[dish.meal][dish.category].push(dish);
  }

  const guestUrl =
    typeof window === "undefined"
      ? ""
      : `${window.location.origin}/event/${event.guest_token}`;

  return (
    <div>
      {/* Sidhuvud */}
      <div className="mb-6">
        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
          Adminvy
        </span>
        <h1 className="text-3xl font-bold text-amber-700 mt-2">{event.name}</h1>
        <p className="text-gray-500 mt-1">
          {new Date(event.date).toLocaleDateString("sv-SE", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          · {event.location}
        </p>
      </div>

      {/* Dela gästlänk */}
      <ShareLink guestToken={event.guest_token} />

      {/* Statistik */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{guests.length}</p>
          <p className="text-sm text-gray-500">gäster</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{dishes.length}</p>
          <p className="text-sm text-gray-500">rätter</p>
        </div>
      </div>

      {/* Rättöversikt */}
      <div className="space-y-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700">Alla rätter</h2>

        {dishes.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            Inga rätter har lagts till än.
          </p>
        ) : (
          mealOrder
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
                            className="bg-white rounded-xl shadow-sm p-4"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-gray-800">
                                  {dish.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {guestMap[dish.guest_id] ?? "Okänd"}
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
                              </div>
                              {event.economy_enabled && dish.cost_sek !== null && (
                                <span className="text-sm font-medium text-gray-600">
                                  {dish.cost_sek} kr
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            ))
        )}
      </div>

      {/* Ekonomisammanställning */}
      {event.economy_enabled && (
        <EconomySummary guests={guests} dishes={dishes} />
      )}
    </div>
  );
}
