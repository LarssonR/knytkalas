export type Meal = "lunch" | "dinner";
export type Category = "starter" | "main" | "dessert" | "side" | "drink" | "bread" | "other";

export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  economy_enabled: boolean;
  admin_token: string;
  guest_token: string;
  created_at: string;
}

export interface Guest {
  id: string;
  event_id: string;
  name: string;
  phone: string;
  created_at: string;
}

export interface Dish {
  id: string;
  event_id: string;
  guest_id: string;
  name: string;
  meal: Meal;
  category: Category;
  contains_gluten: boolean;
  contains_lactose: boolean;
  cost_sek: number | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      events: {
        Row: Event;
        Insert: Omit<Event, "id" | "created_at">;
        Update: Partial<Omit<Event, "id" | "created_at">>;
      };
      guests: {
        Row: Guest;
        Insert: Omit<Guest, "id" | "created_at">;
        Update: Partial<Omit<Guest, "id" | "created_at">>;
      };
      dishes: {
        Row: Dish;
        Insert: Omit<Dish, "id" | "created_at">;
        Update: Partial<Omit<Dish, "id" | "created_at">>;
      };
    };
  };
}
