import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg-base px-6">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-text-secondary">
        404
      </p>
      <h1 className="font-heading mt-4 text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-center text-[15px] leading-relaxed text-text-secondary">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-text-primary/15 bg-white/60 px-7 py-3.5 text-sm font-medium text-text-primary backdrop-blur-sm transition-all duration-300 hover:border-accent-green/40 hover:bg-white/80 hover:shadow-lg hover:shadow-accent-green/5"
      >
        Back to Home
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </Link>
    </div>
  );
}
