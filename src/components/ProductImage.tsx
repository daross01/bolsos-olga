import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";

// Muestra la foto real si existe; si no, un marcador claramente provisional.
// El hueco se adapta a la proporción real de cada foto (no hay marco fijo).
export function ProductImage({ product, className, eager }: { product: Product; className?: string; eager?: boolean }) {
  if (!product.image) {
    return (
      <div className={cn("relative aspect-[4/5] w-full overflow-hidden bg-muted", className)}>
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 border border-dashed border-border p-4 text-center">
          <span className="font-display text-2xl text-muted-foreground">{product.ref}</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Foto provisional</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <img
        src={product.image}
        alt={product.name}
        loading={eager ? "eager" : "lazy"}
        {...(eager ? { fetchPriority: "high" as const } : {})}
        decoding="async"
        className="block h-auto w-full"
      />
    </div>
  );
}
