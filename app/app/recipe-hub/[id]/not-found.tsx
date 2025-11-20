import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 text-center">
      <h1 className="text-3xl font-bold text-ctp-text mb-4">
        Recipe Not Found
      </h1>
      <p className="text-ctp-subtext0 mb-6">
        The recipe you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/app/hub" className="text-ctp-blue hover:text-ctp-sapphire">
        ← Back to all recipes
      </Link>
    </div>
  );
}
