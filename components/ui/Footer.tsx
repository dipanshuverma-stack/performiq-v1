import { appConfig } from "@/lib/app-config";
import { SmartLink as Link } from "@/components/smart-link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-20 border-t border-border bg-background shrink-0">
      <div className="mx-auto max-w-7xl px-8 py-8">

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">

          {/* Brand */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              {appConfig.name}
            </h3>

            <p className="text-sm text-muted-foreground">
              Prepare • Analyze • Improve
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-muted-foreground">

            <Link
              href="/dashboard"
              className="transition-colors hover:text-primary"
            >
              Dashboard
            </Link>

            <Link
              href="/practice"
              className="transition-colors hover:text-primary"
            >
              Practice
            </Link>

            <Link
              href="/mocks"
              className="transition-colors hover:text-primary"
            >
              Mocks
            </Link>

            <Link
              href="/mistakes"
              className="transition-colors hover:text-primary"
            >
              Mistake Book
            </Link>

            <Link
              href="/revision"
              className="transition-colors hover:text-primary"
            >
              Revision
            </Link>

            <Link
              href="/analytics"
              className="transition-colors hover:text-primary"
            >
              Analytics
            </Link>

            <Link
              href="/profile"
              className="transition-colors hover:text-primary"
            >
              Profile
            </Link>

          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">

  <span>
    © {currentYear} {appConfig.name}. All rights reserved.
  </span>

  <span className="font-semibold text-foreground">
    Built with <span className="text-red-500">💖</span> by Dipanshu
  </span>

  <span className="font-mono tracking-wide opacity-70">
    v1.0.0 Stable Engine
  </span>

</div>

      </div>
    </footer>
  );
}