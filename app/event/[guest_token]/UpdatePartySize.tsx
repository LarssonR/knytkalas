"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  guestId: string;
  currentSize: number;
  updatePartySize: (guestId: string, partySize: number) => Promise<void>;
  guestToken: string;
}

export function UpdatePartySize({ guestId, currentSize, updatePartySize, guestToken }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(currentSize);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);
    try {
      await updatePartySize(guestId, value);
      setEditing(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (!editing) {
    return (
      <span className="text-sm text-gray-500">
        {currentSize} {currentSize === 1 ? "person" : "personer"}{" "}
        <button
          onClick={() => setEditing(true)}
          className="text-amber-500 hover:text-amber-600 underline text-sm"
        >
          Ändra
        </button>
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2 mt-1">
      <input
        type="number"
        min="1"
        value={value}
        onChange={(e) => setValue(Math.max(1, parseInt(e.target.value) || 1))}
        className="w-20 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
      />
      <button
        onClick={handleSave}
        disabled={loading}
        className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-3 py-1 rounded-lg transition-colors"
      >
        {loading ? "..." : "Spara"}
      </button>
      <button
        onClick={() => { setEditing(false); setValue(currentSize); }}
        className="text-gray-400 hover:text-gray-600 text-sm"
      >
        Avbryt
      </button>
    </div>
  );
}
