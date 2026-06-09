import type { Guest } from "@/lib/database.types";

interface Props {
  guests: Guest[];
}

export function GuestsList({ guests }: Props) {
  const totalVisitors = guests.reduce((sum, g) => sum + (g.party_size ?? 1), 0);

  if (guests.length === 0) {
    return (
      <p className="text-gray-400 text-center py-8">
        Inga deltagare har anmält sig än.
      </p>
    );
  }

  return (
    <div>
      <div className="space-y-2 mb-4">
        {guests.map((guest) => (
          <div
            key={guest.id}
            className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center"
          >
            <span className="font-medium text-gray-800">{guest.name}</span>
            <span className="text-sm text-gray-500">
              {guest.party_size ?? 1} {(guest.party_size ?? 1) === 1 ? "person" : "personer"}
            </span>
          </div>
        ))}
      </div>
      <div className="bg-amber-50 rounded-xl p-4 text-center">
        <p className="text-sm text-gray-500">
          Totalt{" "}
          <span className="font-semibold text-amber-700">
            {totalVisitors} besökare
          </span>{" "}
          i {guests.length} {guests.length === 1 ? "sällskap" : "sällskap"}
        </p>
      </div>
    </div>
  );
}
