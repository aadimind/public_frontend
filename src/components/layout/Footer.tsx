import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-bg-subtle">
      <div className="container py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link
              to="/"
              className="flex items-center gap-2 font-display text-lg font-semibold"
            >
              <Logo />
              <span>Micromath</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-fg-muted">
              Clear, structured explanations of important research papers —
 without requiring you to decode every page.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-tight">Explore</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <FooterLink to="/papers">All papers</FooterLink>
              <FooterLink to="/categories">Categories</FooterLink>
              <FooterLink to="/search">Search</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-tight">About</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <FooterLink to="/about">About Micromath</FooterLink>
              <FooterLink to="/methodology">Methodology</FooterLink>
              <FooterLink to="/editorial-team">Editorial team</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-tight">Legal</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <FooterLink to="/privacy">Privacy</FooterLink>
              <FooterLink to="/terms">Terms</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 text-xs text-fg-subtle md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} Micromath. Demo content for research reading platform.</span>
          <span>Built with care for curious minds.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        to={to}
        className="text-fg-muted transition-colors hover:text-fg"
      >
        {children}
      </Link>
    </li>
  );
}

function Logo() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10-6h6v12h-6V8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}
