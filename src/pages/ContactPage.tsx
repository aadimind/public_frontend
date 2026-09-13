import { Helmet } from "react-helmet-async";

export function ContactPage() {
  return (
    <>
      <Helmet>
        <title>Contact — Micromath</title>
      </Helmet>
      <div className="container max-w-3xl py-16 md:py-20">
        <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">Contact</h1>
        <p className="mt-4 text-base leading-7 text-fg-muted">Contact information for Micromath will appear here.</p>
      </div>
    </>
  );
}
