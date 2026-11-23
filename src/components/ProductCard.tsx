import { formatPrice, isAvailable, type Product } from "@/data/products";
import { buyMessage, customizeMessage, whatsappLink } from "@/lib/whatsapp";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProductImage } from "./ProductImage";
import { ProductGallery } from "./ProductGallery";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const buttonCls =
  "h-auto whitespace-normal rounded-full px-4 py-3 text-center text-xs uppercase tracking-[0.12em]";

export type Columns = 1 | 2 | 3;

export function ProductCard({
  product,
  eager,
  cols = 1,
}: {
  product: Product;
  eager?: boolean;
  cols?: Columns;
}) {
  const available = isAvailable(product);
  return (
    <Dialog>
      <DialogTrigger aria-label={product.name} className="group block w-full text-left">
        <ProductImage product={product} eager={eager ?? false} className="transition-opacity group-hover:opacity-90" />
        {cols === 3 ? (
          <p className="mt-2 text-right text-[11px] leading-none text-muted-foreground">
            {formatPrice(product.price)}
          </p>
        ) : (
          <>
            <div
              className={cn(
                "mt-3 flex items-baseline justify-between gap-2",
                cols === 2 ? "text-xs" : "text-sm",
              )}
            >
              <h3 className="min-w-0 truncate font-normal">{product.name}</h3>
              <span className="shrink-0">{formatPrice(product.price)}</span>
            </div>
            <p
              className={cn(
                "mt-1 truncate uppercase text-muted-foreground",
                cols === 2 ? "text-[10px] tracking-[0.12em]" : "text-[11px] tracking-[0.18em]",
              )}
            >
              {available ? "Comprar · Personalizar" : "Personalizar"}
            </p>
          </>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[92vh] max-w-md overflow-y-auto overscroll-contain p-4 sm:p-5">
        <ProductGallery product={product} />
        <div className="flex items-start justify-between gap-3">
          <DialogTitle className="text-base font-normal">{product.name}</DialogTitle>
          <span className="shrink-0 text-sm">{formatPrice(product.price)}</span>
        </div>
        <DialogDescription className="text-xs">Hecho a mano · Personalizable</DialogDescription>
        <div className="flex flex-col gap-2">
          {available ? (
            <Button asChild variant="default" className={buttonCls}>
              <a href={whatsappLink(buyMessage(product))} target="_blank" rel="noreferrer">
                Quiero este modelo
              </a>
            </Button>
          ) : (
            <Button disabled variant="secondary" className={buttonCls}>
              Quiero este modelo
            </Button>
          )}
          {!available && (
            <p className="px-1 text-center text-xs leading-relaxed text-muted-foreground">
              Este modelo exacto ya no está disponible: no quedan las mismas telas ni materiales. Puedes
              personalizarlo eligiendo las opciones que sí tengo ahora.
            </p>
          )}
          <Button asChild variant={available ? "outline" : "default"} className={buttonCls}>
            <a href={whatsappLink(customizeMessage(product))} target="_blank" rel="noreferrer">
              Personalizar este modelo
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

