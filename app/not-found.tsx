import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold text-amber-700 mb-4">404</h1>
      <p className="text-gray-500 mb-6">
        Sidan hittades inte. Kontrollera att länken är rätt.
      </p>
      <Link
        href="/"
        className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
      >
        Till startsidan
      </Link>
    </div>
  );
}
