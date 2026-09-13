import { Helmet } from "react-helmet-async";

export function PrivacyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy — Micromath</title>
      </Helmet>
      <div className="container max-w-3xl py-16 md:py-20">
        <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">Privacy</h1>
        <p className="mt-4 text-base leading-7 text-fg-muted">Privacy information for Micromath will appear here.</p>
      </div>
    </>
  );
}
