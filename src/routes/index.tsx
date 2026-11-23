import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { products } from "@/data/products";
import { siteConfig } from "@/data/config";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${siteConfig.tagline} — Catálogo` },
      { name: "description", content: "Bolsos Olga: elige tu bolso o neceser y encárgalo o personalízalo por WhatsApp." },
      { property: "og:title", content: `${siteConfig.tagline} — Catálogo` },
      { property: "og:description", content: "Bolsos Olga: elige un modelo y encárgalo o personalízalo por WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Catalog,
});

const gridCls = {
  1: "grid-cols-1 max-w-xl mx-auto",
  2: "grid-cols-2",
  3: "grid-cols-3",
} as const;

function ColIcon({ n }: { n: 1 | 2 | 3 }) {
  return (
    <span className="flex gap-[2px]">
      {Array.from({ length: n }).map((_, i) => (
        <span key={i} className="h-3.5 w-1.5 rounded-[1px] bg-current" />
      ))}
    </span>
  );
}

function Catalog() {
  const [cols, setCols] = useState<1 | 2 | 3>(2);

  return (
    <section className="mx-auto max-w-6xl px-5 pt-1 pb-10">
      <div className="mb-1 flex justify-start">
        <div className="flex shrink-0 gap-1" role="group" aria-label="Columnas">
          {([1, 2, 3] as const).map((n) => (
            <Button
              key={n}
              variant="ghost"
              size="icon"
              onClick={() => setCols(n)}
              aria-label={`${n} columna${n > 1 ? "s" : ""}`}
              aria-pressed={cols === n}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-sm transition-colors",
                cols === n ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <ColIcon n={n} />
            </Button>
          ))}
        </div>
      </div>
      <div className={cn("grid gap-x-5 gap-y-10 md:gap-x-8", gridCls[cols])}>
        {products.map((p, i) => (
          <ProductCard key={p.ref} product={p} eager={i < 2} cols={cols} />
        ))}
      </div>
    </section>
  );
}

