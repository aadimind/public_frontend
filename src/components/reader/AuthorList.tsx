import type { Author } from "@/types";
import { Avatar } from "@/components/ui/Avatar";

interface AuthorListProps {
  authors: Author[];
  size?: "sm" | "md";
}

export function AuthorList({ authors, size = "md" }: AuthorListProps) {
  if (authors.length === 0) return null;

  return (
    <ul className="space-y-3">
      {authors.map((author) => (
        <li key={author.id} className="flex items-center gap-3">
          <Avatar name={author.name} src={author.avatarUrl} size={size === "md" ? "sm" : "xs"} />
          <div className="text-sm">
            <div className="font-medium text-fg">{author.name}</div>
            {author.affiliation && (
              <div className="text-xs text-fg-muted">{author.affiliation}</div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
