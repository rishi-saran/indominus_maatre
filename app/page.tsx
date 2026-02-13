export default function ComingSoonPage() {
  return (
    <main className="coming-soon-page relative min-h-screen overflow-hidden bg-[#fafaf7]">
      {/* ── Background layers ─────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0">
        {/* Warm gradient wash */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,_rgba(255,220,130,0.35),_transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_100%,_rgba(76,175,80,0.12),_transparent_70%)]" />

        {/* Dot grid — Apple / Linear style */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Floating gradient orbs */}
        <div className="cs-orb absolute left-[12%] top-[8%] h-[28rem] w-[28rem] rounded-full bg-[rgba(255,200,60,0.18)] blur-[100px]" />
        <div className="cs-orb-alt absolute right-[5%] top-[35%] h-[22rem] w-[22rem] rounded-full bg-[rgba(76,175,80,0.14)] blur-[90px]" />
        <div className="cs-orb absolute bottom-[5%] left-[30%] h-[18rem] w-[18rem] rounded-full bg-[rgba(255,243,200,0.35)] blur-[80px]" />

        {/* Noise grain overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* ── Nav bar ───────────────────────────────────────────── */}
      <nav className="cs-reveal relative z-20 mx-auto flex max-w-6xl items-center justify-between px-6 py-6 lg:px-10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--spiritual-green-dark)] shadow-md">
            <span className="text-sm font-bold text-white">M</span>
          </div>
          <span className="text-lg font-semibold tracking-tight text-[var(--spiritual-green-dark)]">
            Maathre
          </span>
        </div>
        <div className="cs-pill flex items-center gap-2 rounded-full border border-[var(--spiritual-green)]/15 bg-white/60 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-[var(--spiritual-green-dark)] shadow-sm backdrop-blur-md">
          <span className="cs-dot relative h-2 w-2 rounded-full bg-[#4CAF50]" />
          Coming Soon
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-16 lg:px-10 lg:pt-24">
        <div className="flex flex-col items-center text-center">
          {/* Overline */}
          <p className="cs-reveal cs-reveal-d1 text-xs font-semibold uppercase tracking-[0.35em] text-[var(--muted-foreground)]">
            India&apos;s #1 Spiritual Platform
          </p>

          {/* Headline — large cinematic type */}
          <h1 className="cs-reveal cs-reveal-d2 mt-6 max-w-4xl text-[clamp(2.6rem,6.5vw,5.8rem)] font-[var(--font-playfair)] leading-[1.08] tracking-tight text-[var(--spiritual-green-dark)]">
            Where tradition meets
            <span className="cs-gradient-text"> devotion</span>
          </h1>

          {/* Sub-copy */}
          <p className="cs-reveal cs-reveal-d3 mt-6 max-w-xl text-lg leading-relaxed text-[var(--muted-foreground)]">
            We&apos;re building a calm, modern space to book vedic rituals, join
            live darshans, and celebrate traditions — all from home.
          </p>

          {/* CTA Group */}
          <div className="cs-reveal cs-reveal-d4 mt-10 flex flex-wrap items-center justify-center gap-4">
            <button className="cs-btn-primary group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-[var(--spiritual-green-dark)] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_4px_24px_rgba(44,122,62,0.35)] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(44,122,62,0.45)]">
              <span className="relative z-10">Get Notified</span>
              <svg
                className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
            <span className="text-sm text-[var(--muted-foreground)]">
              Be the first to experience Maathre
            </span>
          </div>
        </div>

        {/* ── Bento feature grid ────────────────────────────── */}
        <div className="cs-reveal cs-reveal-d5 mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: "🪔",
              title: "Sacred Rituals",
              body: "Book homams, pujas, and ceremonies performed by verified Vedic priests.",
            },
            {
              icon: "📡",
              title: "Live Darshans",
              body: "Watch temple aartis and sacred celebrations streamed in real-time.",
            },
            {
              icon: "🙏",
              title: "Guided Experience",
              body: "Step-by-step booking with calm support — from choosing a service to completion.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="cs-bento group relative overflow-hidden rounded-3xl border border-black/[0.04] bg-white/70 p-7 shadow-[0_1px_3px_rgba(0,0,0,0.04)] backdrop-blur-sm transition-all duration-500 hover:border-black/[0.08] hover:bg-white/90 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--spiritual-cream)] text-xl shadow-inner">
                {item.icon}
              </div>
              <h3 className="text-base font-semibold text-[var(--spiritual-green-dark)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
                {item.body}
              </p>
              {/* Hover glow */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[rgba(255,200,60,0.12)] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
            </div>
          ))}
        </div>

        {/* ── Stats / trust strip ───────────────────────────── */}
        <div className="cs-reveal cs-reveal-d6 mx-auto mt-16 flex max-w-3xl flex-wrap items-center justify-center gap-8 rounded-full border border-black/[0.04] bg-white/60 px-10 py-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] backdrop-blur-sm sm:gap-14">
          {[
            { value: "500+", label: "Verified Priests" },
            { value: "15k+", label: "Happy Devotees" },
            { value: "4.9★", label: "Average Rating" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold tracking-tight text-[var(--spiritual-green-dark)]">
                {stat.value}
              </p>
              <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── Roadmap timeline ──────────────────────────────── */}
        <div className="cs-reveal cs-reveal-d7 mx-auto mt-20 max-w-2xl">
          <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
            What we&apos;re building
          </p>
          <div className="relative space-y-0">
            {/* Vertical line */}
            <div className="absolute bottom-4 left-[19px] top-4 w-px bg-gradient-to-b from-[var(--spiritual-green)] via-[var(--spiritual-yellow)] to-transparent" />

            {[
              { step: "Onboarding trusted priests", status: "done" },
              { step: "Curating sacred services", status: "done" },
              { step: "Live darshan infrastructure", status: "active" },
              { step: "Final polish & serene launch", status: "upcoming" },
            ].map((item, i) => (
              <div key={item.step} className="relative flex items-start gap-5 py-4">
                {/* Dot */}
                <div
                  className={`relative z-10 mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                    item.status === "done"
                      ? "border-[var(--spiritual-green)] bg-[var(--spiritual-green)] text-white"
                      : item.status === "active"
                        ? "cs-dot-ping border-[var(--spiritual-green)] bg-white text-[var(--spiritual-green-dark)]"
                        : "border-black/10 bg-white text-[var(--muted-foreground)]"
                  }`}
                >
                  {item.status === "done" ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  ) : (
                    `0${i + 1}`
                  )}
                </div>
                <div className="pt-1.5">
                  <p
                    className={`text-sm font-medium ${
                      item.status === "upcoming"
                        ? "text-[var(--muted-foreground)]"
                        : "text-[var(--spiritual-green-dark)]"
                    }`}
                  >
                    {item.step}
                  </p>
                  {item.status === "active" && (
                    <span className="mt-1 inline-block rounded-full bg-[var(--spiritual-yellow-light)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--spiritual-green-dark)]">
                      In progress
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-black/[0.04] bg-white/40 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-8 sm:flex-row sm:justify-between lg:px-10">
          <p className="text-xs text-[var(--muted-foreground)]">
            © 2026 Maathre. Crafted with devotion.
          </p>
          <div className="flex items-center gap-6">
            {["Instagram", "Twitter", "YouTube"].map((s) => (
              <span
                key={s}
                className="cursor-pointer text-xs font-medium text-[var(--muted-foreground)] transition-colors hover:text-[var(--spiritual-green-dark)]"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
