import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <p className="eyebrow">404 · Page not found</p>
      <h1>This research record lives on one page.</h1>
      <p>
        The former methodology and results routes have been retired. Continue
        through the current source-traced project overview.
      </p>
      <Link className="button button--light" href="/">
        Return to the study
      </Link>
    </main>
  );
}
