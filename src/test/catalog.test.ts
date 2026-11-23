import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { products, getRecommendations, applyCatalogCsv, isAvailable } from "@/data/products";
import { siteConfig } from "@/data/config";
import { buyMessage, customizeMessage, whatsappLink } from "@/lib/whatsapp";

const b001 = products.find((p) => p.ref === "B001");
if (!b001) throw new Error("Falta el producto B001");

describe("catálogo", () => {
  it("sirve todas las fotos desde los archivos existentes en public/productos", () => {
    for (const product of products) {
      expect(product.image).toMatch(/^\/productos\/[a-z0-9]+\.jpg$/);
      expect(existsSync(`${process.cwd()}/public${product.image}`)).toBe(true);
    }
  });
  it("tiene 11 bolsos, 6 neceseres y 1 complemento", () => {
    expect(products.filter((p) => p.category === "bolsos")).toHaveLength(11);
    expect(products.filter((p) => p.category === "neceseres")).toHaveLength(6);
    expect(products.filter((p) => p.category === "complementos")).toHaveLength(1);
  });
  it("no incluye los productos dados de baja", () => {
    for (const ref of ["N001", "N006", "N007"]) {
      expect(products.some((p) => p.ref === ref)).toBe(false);
    }
  });
  it("recomienda solo de la misma categoría y sin repetir el actual", () => {
    const recs = getRecommendations(b001);
    expect(recs.length).toBeGreaterThanOrEqual(3);
    expect(recs.every((r) => r.category === "bolsos" && r.ref !== "B001")).toBe(true);
  });
  it("genera el mensaje de compra con nombre y referencia", () => {
    expect(buyMessage({ ...b001, availability: "disponible" })).toBe(
      "¡Hola! Me gustaría comprar el Bolso tote patchwork teja y beige (ref. B001). ¿Sigue disponible y cómo podemos gestionarlo?",
    );
  });
  it("genera el mensaje de personalización con nombre y referencia", () => {
    expect(customizeMessage(b001)).toBe(
      "¡Hola! Me gustaría personalizar el Bolso tote patchwork teja y beige (ref. B001). ¿Podrías decirme qué opciones de telas, colores o medidas tienes disponibles?",
    );
  });
  it("usa el artículo correcto según el nombre del producto", () => {
    const mochila = products.find((p) => p.name.startsWith("Mochila"));
    expect(mochila).toBeDefined();
    if (!mochila) throw new Error("Falta la mochila");
    expect(buyMessage(mochila)).toContain("la Mochila mostaza con estampado étnico (ref. ");
  });
  it("envía los mensajes al número de WhatsApp de la tienda", () => {
    expect(siteConfig.whatsappNumber).toBe("34611430568");
    expect(whatsappLink(buyMessage(b001)).startsWith("https://wa.me/34611430568?text=")).toBe(true);
  });
  it("codifica el mensaje en el enlace wa.me", () => {
    const url = whatsappLink(customizeMessage(b001), "34 600");
    expect(url.startsWith("https://wa.me/34600?text=")).toBe(true);
    expect(decodeURIComponent(url.split("text=")[1] ?? "")).toBe(customizeMessage(b001));
  });
});

describe("controles del CSV", () => {
  const header = "ref;nombre;precio;disponible;visible;carpeta_fotos\n";
  it("disponible=no permite ver y personalizar el modelo pero no lo ofrece como disponible", () => {
    const [product] = applyCatalogCsv([b001], header + "B001;;30;no;si;fotos-b001");
    if (!product) throw new Error("El producto debe seguir visible");
    expect(isAvailable(product)).toBe(false);
    expect(buyMessage(product)).not.toContain("uno igual");
    expect(buyMessage(product)).toContain("telas y materiales que tengas disponibles");
    expect(customizeMessage(product)).toContain("personalizar");
  });
  it("visible=no oculta el producto sin borrar su fila", () => {
    expect(applyCatalogCsv([b001], header + "B001;;30;si;no;fotos-b001")).toHaveLength(0);
  });
  it("si y los valores vacíos conservan productos visibles y disponibles", () => {
    const base = [{ ...b001, availability: "disponible" as const }];
    for (const flags of ["si;si", ";", "SI;SI"]) {
      const [product] = applyCatalogCsv(base, header + `B001;;30;${flags};`);
      if (!product) throw new Error("El producto debe seguir visible");
      expect(isAvailable(product)).toBe(true);
    }
  });
  it("carpeta_fotos incorpora sus JPG en orden tras la foto principal y no mezcla otros modelos", () => {
    const [product] = applyCatalogCsv([b001], header + "B001;;30;si;si;fotos-b001", [
      "/productos/fotos-b001/01.jpg", "/productos/fotos-b001/02.jpg", "/productos/fotos-b002/01.jpg",
    ]);
    expect(product?.images).toEqual(["/productos/b001.jpg", "/productos/fotos-b001/01.jpg", "/productos/fotos-b001/02.jpg"]);
  });
  it("una carpeta sin fotos mantiene la foto principal", () => {
    const [product] = applyCatalogCsv([b001], header + "B001;;30;si;si;fotos-b001");
    expect(product?.images).toEqual(["/productos/b001.jpg"]);
  });
  it("preserva los nombres y precios actuales y admite precios con coma", () => {
    const [product] = applyCatalogCsv([b001], header + "B001;Mi bolso;30,50;si;si;");
    expect(product?.name).toBe("Mi bolso");
    expect(product?.price).toBe(30.5);
    expect(products.find((product) => product.ref === "B010")?.price).toBe(25);
  });
});

