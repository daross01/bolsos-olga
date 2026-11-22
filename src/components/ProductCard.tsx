import { formatPrice, isAvailable, type Product } from "@/data/products";
import { buyMessage, customizeMessage, whatsappLink } from "@/lib/whatsapp";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProductImage } from "./ProductImage";
import { ProductGallery } from "./ProductGallery";
import { Button } from "@/components/ui/button";

const buttonCls =
  "h-auto whitespace-normal rounded-full px-4 py-3 text-center text-xs uppercase tracking-[0.12em]";

export function ProductCard({ product, eager }: { product: Product; eager?: boolean }) {
  const available = isAvailable(product);
  return (
    <Dialog>
      <DialogTrigger className="group block w-full text-left">
        <ProductImage product={product} eager={eager ?? false} className="transition-opacity group-hover:opacity-90" />
        <div className="mt-3 flex items-start justify-between gap-3 text-sm">
          <h3 className="font-normal">{product.name}</h3>
          <span className="shrink-0">{formatPrice(product.price)}</span>
        </div>
        <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {available ? "Comprar · Personalizar" : "Personalizar"}
        </p>
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
              Este modelo exacto no está disponible ahora. Personalízalo con las telas y detalles que van contigo.
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
