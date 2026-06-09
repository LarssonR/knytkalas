"use client";

import { useState } from "react";

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface Props {
  tabs: Tab[];
}

export function Tabs({ tabs }: Props) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActive(i)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              active === i
                ? "border-amber-500 text-amber-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{tabs[active].content}</div>
    </div>
  );
}
