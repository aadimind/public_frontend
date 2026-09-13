import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { cn } from "@/lib/utils";

const buttonBase =
  "inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-all duration-150 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-offset-2";

export function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>Page not found — Micromath</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="container max-w-2xl py-24 text-center md:py-32">
        <div className="mb-6 font-display text-6xl font-semibold tracking-tight text-fg md:text-8xl">
          404
        </div>
        <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
          Page not found
        </h1>
        <p className="mt-3 text-base text-fg-muted">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className={cn(buttonBase, "bg-fg text-fg-inverse hover:opacity-90")}
          >
            Go home
          </Link>
          <Link
            to="/papers"
            className={cn(buttonBase, "border border-border-strong bg-transparent text-fg hover:bg-bg-muted")}
          >
            Browse papers
          </Link>
        </div>
      </div>
    </>
  );
}
