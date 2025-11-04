import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 text-center">
      <h1 className="text-3xl font-bold text-ctp-text mb-4">
        Shared Recipe Not Found
      </h1>
      <p className="text-ctp-subtext0 mb-6">
        This recipe may have expired (30 day limit) or never existed.
      </p>
      <Link href="/" className="text-ctp-blue hover:text-ctp-sapphire">
        ← Browse all recipes
      </Link>
    </div>
  );
}
