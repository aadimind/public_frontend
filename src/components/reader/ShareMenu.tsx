import { useEffect, useRef, useState } from "react";
import { Check, Link as LinkIcon, Share2 } from "lucide-react";
import { Dropdown, DropdownItem, DropdownSeparator } from "@/components/ui/Dropdown";
import { Button } from "@/components/ui/Button";

interface ShareMenuProps {
  title: string;
  url: string;
}

export function ShareMenu({ title, url }: ShareMenuProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        setCopied(false);
        timerRef.current = null;
      }, 2000);
    } catch {
      /* ignore */
    }
  };

  const shareTwitter = () => {
    const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
    window.open(intent, "_blank", "noopener,noreferrer,width=550,height=420");
  };

  const shareLinkedIn = () => {
    const intent = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(intent, "_blank", "noopener,noreferrer,width=550,height=550");
  };

  return (
    <Dropdown
      align="end"
      trigger={
        <Button variant="outline" size="sm" leftIcon={<Share2 className="h-3.5 w-3.5" />}>
          Share
        </Button>
      }
    >
      {(close) => (
        <div className="py-1">
          <DropdownItem onSelect={() => { copyLink(); close(); }}>
            {copied ? <Check className="h-3.5 w-3.5" /> : <LinkIcon className="h-3.5 w-3.5" />}
            {copied ? "Copied!" : "Copy link"}
          </DropdownItem>
          <DropdownSeparator />
          <DropdownItem onSelect={() => { shareTwitter(); close(); }}>
            <XIcon />
            Share on X
          </DropdownItem>
          <DropdownItem onSelect={() => { shareLinkedIn(); close(); }}>
            <LinkedInIcon />
            Share on LinkedIn
          </DropdownItem>
        </div>
      )}
    </Dropdown>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
