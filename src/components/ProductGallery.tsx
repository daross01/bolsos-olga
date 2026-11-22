import type { Product } from "@/data/products";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ProductImage } from "./ProductImage";

export function ProductGallery({ product }: { product: Product }) {
  const images = product.images ?? (product.image ? [product.image] : []);
  if (images.length < 2) return <ProductImage product={product} />;
  return (
    <Carousel opts={{ align: "start" }} aria-label={`Fotos de ${product.name}`}>
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={image} aria-label={`Foto ${index + 1} de ${images.length}`}>
            <div className="aspect-[4/5] bg-muted">
              <img src={image} alt={`${product.name} — foto ${index + 1}`} className="h-full w-full object-contain" loading={index === 0 ? "eager" : "lazy"} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" aria-label="Foto anterior" title="Foto anterior" />
      <CarouselNext className="right-2" aria-label="Foto siguiente" title="Foto siguiente" />
    </Carousel>
  );
}