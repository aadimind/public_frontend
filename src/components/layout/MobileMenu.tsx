import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Home", end: true },
  { to: "/papers", label: "Papers" },
  { to: "/categories", label: "Categories" },
];

interface MobileMenuProps {
  onClose: () => void;
}

export function MobileMenu({ onClose }: MobileMenuProps) {
  return (
    <nav
      id="mobile-navigation-links" className="flex flex-col gap-1 p-4"
      aria-label="Mobile navigation"
    >
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onClose}
          className={({ isActive }) =>
            cn(
              "rounded-md px-3 py-3 text-base font-medium transition-colors",
              isActive
                ? "bg-bg-muted text-fg"
                : "text-fg-muted hover:bg-bg-muted hover:text-fg"
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
