import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import makerImage from "@/assets/maker.jpg";

// ─────────────────────────────────────────────────────────────
// UPDATE WHATSAPP NUMBER HERE (country code + number, no "+")
const WHATSAPP_NUMBER = "917849061209";
// ─────────────────────────────────────────────────────────────

const INSTAGRAM_URL = "https://www.instagram.com/swatis_craft_world/";
const SHEET_URL = "https://api.sheetbest.com/sheets/a9c43c64-1274-412e-8791-c5ede03e7be1";

type Product = {
  name: string;
  price: string;
  image: string;
  description: string;
  category: string;
  inStock: string;
};

export const Route = createFileRoute("/")({
  component: Index,
});

async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(SHEET_URL);
  if (!res.ok) throw new Error("Failed to load products");
  const raw = (await res.json()) as Record<string, string>[];
  return raw.map((r) => ({
    name: (r.name ?? "").trim(),
    price: (r.price ?? "").trim(),
    image: (r.image ?? "").trim(),
    description: (r["description "] ?? r.description ?? "").trim(),
    category: (r.category ?? "").trim(),
    inStock: (r.inStock ?? "").trim().toLowerCase(),
  }));
}

function whatsappHref(p: Product) {
  const msg = `Hi! I'm interested in ${p.name} (₹${p.price}). Is it available?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

function InstagramGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--color-line)]/60 bg-[color:var(--color-ivory)]/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        <div className="flex items-baseline gap-3">
          <a href="#top" className="font-serif text-xl md:text-2xl tracking-tight text-[color:var(--color-ink)]">
            Swati's Craft World
          </a>
          <span className="hidden sm:inline text-[10px] uppercase tracking-[0.28em] text-[color:var(--color-ink)]/55">
            Est. Odisha
          </span>
        </div>
        <nav className="flex items-center gap-6 md:gap-8">
          <a href="#collection" className="hidden sm:inline text-xs uppercase tracking-[0.22em] text-[color:var(--color-ink)]/70 hover:text-[color:var(--color-bronze)] transition">
            Collection
          </a>
          <a href="#maker" className="hidden sm:inline text-xs uppercase tracking-[0.22em] text-[color:var(--color-ink)]/70 hover:text-[color:var(--color-bronze)] transition">
            The Maker
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="text-[color:var(--color-ink)] hover:text-[color:var(--color-bronze)] transition"
          >
            <InstagramGlyph className="h-5 w-5" />
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative bg-[color:var(--color-obsidian)] text-[color:var(--color-bone)]">
      <div className="mx-auto max-w-7xl px-6 md:px-10 pt-24 pb-28 md:pt-36 md:pb-40">
        <div className="text-[10px] uppercase tracking-[0.4em] text-[color:var(--color-bone)]/60 mb-8">
          Handmade in Odisha — Since the studio began
        </div>
        <h1 className="font-serif text-[13vw] sm:text-7xl md:text-8xl lg:text-[7.5rem] leading-[0.95] tracking-tight max-w-5xl">
          The quiet work<br />
          of <em className="italic text-[color:var(--color-bronze-soft)] font-normal">hand</em>, thread<br />
          and thread again.
        </h1>
        <p className="mt-10 max-w-xl text-base md:text-lg leading-relaxed text-[color:var(--color-bone)]/70">
          A small independent studio making rakhis and considered craft objects — one at a time, by one pair of hands, from a home in Odisha.
        </p>
        <div className="mt-12 flex flex-wrap items-center gap-4">
          <a
            href="#collection"
            className="inline-flex items-center gap-3 border border-[color:var(--color-bone)]/70 px-7 py-4 text-xs uppercase tracking-[0.28em] hover:bg-[color:var(--color-bone)] hover:text-[color:var(--color-obsidian)] transition"
          >
            View the collection
            <span aria-hidden>→</span>
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="text-xs uppercase tracking-[0.28em] text-[color:var(--color-bone)]/70 hover:text-[color:var(--color-bronze-soft)] transition"
          >
            @swatis_craft_world
          </a>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ p }: { p: Product }) {
  const soldOut = p.inStock === "no";
  return (
    <article className="group flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden bg-[color:var(--color-bone)]">
        {p.image ? (
          <img
            src={p.image}
            alt={p.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-[900ms] ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.2em] text-[color:var(--color-ink)]/40">
            No image
          </div>
        )}
        {soldOut && (
          <div className="absolute left-4 top-4 bg-[color:var(--color-obsidian)] px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[color:var(--color-bone)]">
            Sold out
          </div>
        )}
      </div>
      <div className="pt-5 flex flex-col flex-1">
        {p.category && (
          <div className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--color-ink)]/50">
            {p.category}
          </div>
        )}
        <h3 className="mt-1.5 font-serif text-2xl md:text-[1.6rem] leading-tight text-[color:var(--color-ink)]">
          {p.name}
        </h3>
        {p.description && (
          <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-ink)]/65 max-w-md">
            {p.description}
          </p>
        )}
        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="text-sm tracking-wide text-[color:var(--color-ink)]/75">
            ₹{p.price}
          </div>
          {soldOut ? (
            <button
              disabled
              className="border border-[color:var(--color-line)] px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-ink)]/40 cursor-not-allowed"
            >
              Unavailable
            </button>
          ) : (
            <a
              href={whatsappHref(p)}
              target="_blank"
              rel="noreferrer"
              className="border border-[color:var(--color-ink)] px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-ink)] hover:bg-[color:var(--color-ink)] hover:text-[color:var(--color-bone)] transition"
            >
              Buy on WhatsApp
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function Collection() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 60_000,
  });
  const [active, setActive] = useState<string>("All");

  const categories = useMemo(() => {
    const set = new Set<string>();
    (data ?? []).forEach((p) => p.category && set.add(p.category));
    return ["All", ...Array.from(set)];
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    return active === "All" ? data : data.filter((p) => p.category === active);
  }, [data, active]);

  return (
    <section id="collection" className="bg-[color:var(--color-ivory)]">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-24 md:py-32">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
          <div className="max-w-2xl">
            <div className="text-[10px] uppercase tracking-[0.32em] text-[color:var(--color-ink)]/55 mb-4">
              The Collection — 01
            </div>
            <h2 className="font-serif text-5xl md:text-6xl leading-[1.02] text-[color:var(--color-ink)]">
              In the <em className="italic text-[color:var(--color-bronze)] font-normal">studio</em>, now.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[color:var(--color-ink)]/65">
            Each piece is made to be kept. Small batches, natural materials, and the small imperfections that mark a thing as made — not manufactured.
          </p>
        </div>

        {categories.length > 1 && (
          <div className="mb-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-[color:var(--color-line)] py-4">
            {categories.map((c) => {
              const isActive = c === active;
              return (
                <button
                  key={c}
                  onClick={() => setActive(c)}
                  className={`text-[11px] uppercase tracking-[0.28em] transition ${
                    isActive
                      ? "text-[color:var(--color-bronze)]"
                      : "text-[color:var(--color-ink)]/55 hover:text-[color:var(--color-ink)]"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col">
                <div className="aspect-[3/4] bg-[color:var(--color-line)]/40 animate-pulse" />
                <div className="mt-5 h-3 w-24 bg-[color:var(--color-line)]/50 animate-pulse" />
                <div className="mt-3 h-5 w-3/4 bg-[color:var(--color-line)]/50 animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="border border-[color:var(--color-line)] p-10 text-center">
            <p className="font-serif text-2xl text-[color:var(--color-ink)]">The collection couldn't load.</p>
            <p className="mt-2 text-sm text-[color:var(--color-ink)]/60">Please check your connection and try again.</p>
            <button
              onClick={() => refetch()}
              className="mt-6 border border-[color:var(--color-ink)] px-6 py-3 text-[11px] uppercase tracking-[0.22em] hover:bg-[color:var(--color-ink)] hover:text-[color:var(--color-bone)] transition"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <div className="border border-[color:var(--color-line)] p-16 text-center">
            <p className="font-serif text-3xl text-[color:var(--color-ink)]">
              The shelves are being restocked.
            </p>
            <p className="mt-3 text-sm text-[color:var(--color-ink)]/60">
              Follow along on Instagram for the next release.
            </p>
          </div>
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
            {filtered.map((p, i) => (
              <ProductCard key={`${p.name}-${i}`} p={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Maker() {
  return (
    <section id="maker" className="bg-[color:var(--color-bone)] border-t border-[color:var(--color-line)]/70">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-24 md:py-32 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div className="overflow-hidden">
          <img
            src={makerImage}
            alt="Swati at her worktable in Odisha, tying rakhis by hand"
            loading="lazy"
            width={1280}
            height={1280}
            className="w-full h-auto object-cover aspect-square"
          />
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--color-bronze)] mb-6">
            Our Story
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.05] text-[color:var(--color-ink)]">
            Hi, I'm Swati —{" "}
            <em className="italic text-[color:var(--color-bronze)] font-normal">
              maker of small, quiet things.
            </em>
          </h2>
          <p className="mt-8 text-base md:text-lg leading-relaxed text-[color:var(--color-ink)]/80">
            What began as a hobby at my kitchen table has slowly grown into Swati's Craft World — a tiny studio where I knot thread, string beads and fold quiet little moments into wearable, giftable things.
          </p>
          <p className="mt-5 text-base md:text-lg leading-relaxed text-[color:var(--color-ink)]/80">
            Every piece is made by hand in small batches, so no two are ever quite the same — and I rather like it that way.
          </p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-flex items-center gap-2 text-sm text-[color:var(--color-bronze)] hover:text-[color:var(--color-ink)] transition"
          >
            Peek inside the studio on Instagram
            <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[color:var(--color-obsidian)] text-[color:var(--color-bone)]">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          <div>
            <div className="font-serif text-3xl">Swati's Craft World</div>
            <div className="mt-3 text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-bone)]/55">
              Est. Odisha, India
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-bone)]/55 mb-4">
              Elsewhere
            </div>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 text-sm text-[color:var(--color-bone)]/85 hover:text-[color:var(--color-bronze-soft)] transition"
            >
              <InstagramGlyph className="h-4 w-4" />
              @swatis_craft_world
            </a>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-bone)]/55 mb-4">
              Orders & Enquiries
            </div>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-[color:var(--color-bone)]/85 hover:text-[color:var(--color-bronze-soft)] transition"
            >
              WhatsApp the studio →
            </a>
          </div>
        </div>
        <div className="mt-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-[color:var(--color-bone)]/15 pt-8 text-[11px] uppercase tracking-[0.24em] text-[color:var(--color-bone)]/45">
          <div>© {new Date().getFullYear()} Swati's Craft World. All rights reserved.</div>
          <div>Handmade, one at a time.</div>
        </div>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-[color:var(--color-ivory)] text-[color:var(--color-ink)] font-sans antialiased">
      <Header />
      <main>
        <Hero />
        <Collection />
        <Maker />
      </main>
      <Footer />
    </div>
  );
}
