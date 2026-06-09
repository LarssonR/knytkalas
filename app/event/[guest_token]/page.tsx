import { notFound } from "next/navigation";
import { getEventByGuestToken, registerGuest, addDish, deleteDish } from "@/app/actions";
import { GuestRegistration } from "./GuestRegistration";
import { DishList } from "./DishList";
import { AddDishForm } from "./AddDishForm";
import type { Guest } from "@/lib/database.types";

interface Props {
  params: Promise<{ guest_token: string }>;
  searchParams: Promise<{ guest_id?: string }>;
}

export default async function EventPage({ params, searchParams }: Props) {
  const { guest_token } = await params;
  const { guest_id } = await searchParams;

  const data = await getEventByGuestToken(guest_token);

  if (!data) notFound();

  const { event, guests, dishes } = data;

  const currentGuest: Guest | undefined = guest_id
    ? guests.find((g) => g.id === guest_id)
    : undefined;

  const mealLabels: Record<string, string> = {
    lunch: "Lunch",
    dinner: "Middag",
  };

  const categoryLabels: Record<string, string> = {
    starter: "Förrätt",
    main: "Huvudrätt",
    dessert: "Efterrätt",
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-amber-700">{event.name}</h1>
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

      {!currentGuest ? (
        // Gästen är inte registrerad — visa registreringsformulär
        <GuestRegistration
          eventId={event.id}
          guestToken={guest_token}
          registerGuest={registerGuest}
        />
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
            <p className="text-sm text-gray-500">
              Inloggad som{" "}
              <span className="font-semibold text-gray-700">
                {currentGuest.name}
              </span>
            </p>
          </div>

          {/* Lägg till rätt */}
          <AddDishForm
            guestId={currentGuest.id}
            guestToken={guest_token}
            economyEnabled={event.economy_enabled}
            addDish={addDish}
          />
        </>
      )}

      {/* Lista på alla rätter */}
      <DishList
        dishes={dishes}
        guests={guests}
        currentGuestId={currentGuest?.id}
        guestToken={guest_token}
        economyEnabled={event.economy_enabled}
        mealLabels={mealLabels}
        categoryLabels={categoryLabels}
        deleteDish={deleteDish}
      />
    </div>
  );
}
