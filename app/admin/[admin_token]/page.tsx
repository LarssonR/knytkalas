import { notFound } from "next/navigation";
import { getEventByAdminToken, registerGuest, addDish, deleteDish } from "@/app/actions";
import { ShareLink } from "./ShareLink";
import { EconomySummary } from "./EconomySummary";
import { AdminDishList } from "./AdminDishList";
import { GuestRegistration } from "@/app/event/[guest_token]/GuestRegistration";
import { AddDishForm } from "@/app/event/[guest_token]/AddDishForm";
import type { Dish, Guest } from "@/lib/database.types";

interface Props {
  params: Promise<{ admin_token: string }>;
  searchParams: Promise<{ guest_id?: string }>;
}

const mealLabels: Record<string, string> = { lunch: "Lunch", dinner: "Middag" };
const categoryLabels: Record<string, string> = {
  starter: "Förrätt",
  main: "Huvudrätt",
  dessert: "Efterrätt",
  side: "Tillbehör",
  drink: "Dryck",
  bread: "Bröd",
  other: "",
};

export default async function AdminPage({ params, searchParams }: Props) {
  const { admin_token } = await params;
  const { guest_id } = await searchParams;
  const data = await getEventByAdminToken(admin_token);

  if (!data) notFound();

  const { event, guests, dishes } = data;

  const currentGuest: Guest | undefined = guest_id
    ? guests.find((g) => g.id === guest_id)
    : undefined;

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
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{guests.length}</p>
          <p className="text-sm text-gray-500">sällskap</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{guests.reduce((sum, g) => sum + (g.party_size ?? 1), 0)}</p>
          <p className="text-sm text-gray-500">besökare</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{dishes.length}</p>
          <p className="text-sm text-gray-500">rätter</p>
        </div>
      </div>

      {/* Rättöversikt — admin kan ta bort alla rätter */}
      <AdminDishList
        dishes={dishes}
        guests={guests}
        adminToken={admin_token}
        economyEnabled={event.economy_enabled}
        mealLabels={mealLabels}
        categoryLabels={categoryLabels}
        deleteDish={deleteDish}
      />

      {/* Ekonomisammanställning */}
      {event.economy_enabled && (
        <EconomySummary guests={guests} dishes={dishes} />
      )}

      {/* Admin lägger till sina egna rätter */}
      <div className="mt-8 border-t border-gray-200 pt-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Lägg till din rätt
        </h2>
        {!currentGuest ? (
          <GuestRegistration
            eventId={event.id}
            guestToken={`admin-${admin_token}`}
            registerGuest={registerGuest}
            redirectBase={`/admin/${admin_token}`}
          />
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-md p-4 mb-4">
              <p className="text-sm text-gray-500">
                Lägger till som{" "}
                <span className="font-semibold text-gray-700">
                  {currentGuest.name}
                </span>
              </p>
            </div>
            <AddDishForm
              guestId={currentGuest.id}
              guestToken={event.guest_token}
              economyEnabled={event.economy_enabled}
              addDish={addDish}
            />
          </>
        )}
      </div>
    </div>
  );
}
