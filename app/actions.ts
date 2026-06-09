"use server";

import { createServiceClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

// Skapa ett nytt evenemang
export async function createEvent(formData: FormData) {
  const supabase = createServiceClient();

  const name = formData.get("name") as string;
  const date = formData.get("date") as string;
  const location = formData.get("location") as string;
  const economy_enabled = formData.get("economy_enabled") === "on";

  const { data, error } = await supabase
    .from("events")
    .insert({ name, date, location, economy_enabled })
    .select()
    .single();

  if (error) throw new Error("Kunde inte skapa evenemanget: " + error.message);

  return data;
}

// Registrera eller hämta en gäst (namn + telefon = identitet)
export async function registerGuest(
  eventId: string,
  name: string,
  phone: string,
  partySize: number = 1
) {
  const supabase = createServiceClient();

  // Kolla om gästen redan finns
  const { data: existing } = await supabase
    .from("guests")
    .select()
    .eq("event_id", eventId)
    .eq("phone", phone)
    .single();

  if (existing) return existing;

  const { data, error } = await supabase
    .from("guests")
    .insert({ event_id: eventId, name, phone, party_size: partySize })
    .select()
    .single();

  if (error) throw new Error("Kunde inte registrera gästen: " + error.message);

  return data;
}

// Lägg till en rätt
export async function addDish(formData: FormData, guestToken: string) {
  const supabase = createServiceClient();

  // Hämta evenemanget via guest_token
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select()
    .eq("guest_token", guestToken)
    .single();

  if (eventError || !event)
    throw new Error("Evenemanget hittades inte.");

  const guest_id = formData.get("guest_id") as string;
  const name = formData.get("dish_name") as string;
  const meal = formData.get("meal") as string;
  const category = formData.get("category") as string;
  const contains_gluten = formData.get("contains_gluten") === "on";
  const contains_lactose = formData.get("contains_lactose") === "on";
  const cost_raw = formData.get("cost_sek") as string;
  const cost_sek =
    event.economy_enabled && cost_raw ? parseFloat(cost_raw) : null;

  const { error } = await supabase.from("dishes").insert({
    event_id: event.id,
    guest_id,
    name,
    meal,
    category,
    contains_gluten,
    contains_lactose,
    cost_sek,
  });

  if (error) throw new Error("Kunde inte lägga till rätten: " + error.message);

  revalidatePath(`/event/${guestToken}`);
}

// Uppdatera antal i sällskapet
export async function updatePartySize(guestId: string, partySize: number) {
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("guests")
    .update({ party_size: Math.max(1, partySize) })
    .eq("id", guestId);

  if (error) throw new Error("Kunde inte uppdatera antal: " + error.message);
}

// Ta bort en rätt
export async function deleteDish(dishId: string, guestToken: string) {
  const supabase = createServiceClient();

  const { error } = await supabase.from("dishes").delete().eq("id", dishId);

  if (error) throw new Error("Kunde inte ta bort rätten: " + error.message);

  revalidatePath(`/event/${guestToken}`);
}

// Hämta evenemang + gäster + rätter via guest_token
export async function getEventByGuestToken(guestToken: string) {
  const supabase = createServiceClient();

  const { data: event, error } = await supabase
    .from("events")
    .select()
    .eq("guest_token", guestToken)
    .single();

  if (error || !event) return null;

  const { data: guests } = await supabase
    .from("guests")
    .select()
    .eq("event_id", event.id);

  const { data: dishes } = await supabase
    .from("dishes")
    .select()
    .eq("event_id", event.id);

  return { event, guests: guests ?? [], dishes: dishes ?? [] };
}

// Hämta evenemang + gäster + rätter via admin_token
export async function getEventByAdminToken(adminToken: string) {
  const supabase = createServiceClient();

  const { data: event, error } = await supabase
    .from("events")
    .select()
    .eq("admin_token", adminToken)
    .single();

  if (error || !event) return null;

  const { data: guests } = await supabase
    .from("guests")
    .select()
    .eq("event_id", event.id);

  const { data: dishes } = await supabase
    .from("dishes")
    .select()
    .eq("event_id", event.id);

  return { event, guests: guests ?? [], dishes: dishes ?? [] };
}
