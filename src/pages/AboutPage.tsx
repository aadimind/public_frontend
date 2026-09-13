import { Helmet } from "react-helmet-async";

export function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Micromath — Micromath</title>
      </Helmet>
      <div className="container max-w-3xl py-16 md:py-20">
        <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">About Micromath</h1>
        <p className="mt-4 text-base leading-7 text-fg-muted">Micromath is a research reading platform for clear, structured explanations of important papers.</p>
      </div>
    </>
  );
}
