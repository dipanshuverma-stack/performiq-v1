import Link from "next/link";

export function SettingsCard() {
  return (
    <Link
      href="/settings"
      className="rounded-3xl border border-white/[0.08] bg-[#0E121B] p-6 hover:border-blue-500/30 transition-all group"
    >
      <div className="mb-3 text-3xl">⚙️</div>
      <h3 className="font-semibold text-lg group-hover:text-blue-400 transition-colors">Settings</h3>
      <p className="mt-1 text-sm text-muted-foreground">Account preferences</p>
    </Link>
  );
}