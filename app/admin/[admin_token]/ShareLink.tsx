"use client";

import { useState } from "react";

interface Props {
  guestToken: string;
}

export function ShareLink({ guestToken }: Props) {
  const [copied, setCopied] = useState(false);

  const url = `${window.location.origin}/event/${guestToken}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
      <p className="text-sm font-medium text-gray-600 mb-2">
        Dela denna länk med dina gäster:
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          readOnly
          value={url}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-gray-50 truncate"
        />
        <button
          onClick={handleCopy}
          className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shrink-0"
        >
          {copied ? "Kopierat!" : "Kopiera"}
        </button>
      </div>
    </div>
  );
}
