import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0c0f0d] text-[#e5e7eb] p-6 text-center space-y-5">
      <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400">
        <Compass className="w-7 h-7 text-emerald-400" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          404 &bull; Off the Beaten Trail
        </h1>
        <p className="text-sm text-neutral-400 max-w-md">
          This digital pathway does not exist. The real world is outside your door.
        </p>
      </div>
      <div className="pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition shadow-lg shadow-emerald-950"
        >
          <ArrowLeft className="w-4 h-4" /> Return to IRL Quest
        </Link>
      </div>
    </div>
  );
}
