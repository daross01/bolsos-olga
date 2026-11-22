import { siteConfig } from "@/data/config";
import { isAvailable, type Product } from "@/data/products";

export function whatsappLink(message?: string, number = siteConfig.whatsappNumber) {
  const base = `https://wa.me/${number.replace(/\D/g, "")}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

// Artículo correcto para el nombre del producto: "el Bolso…", "la Mochila…".
const FEMENINOS = ["Mochila", "Cartera", "Bolsa", "Pajarita", "Gorra"];

function article(name: string) {
  const primera = name.split(" ")[0] ?? "";
  return FEMENINOS.includes(primera) ? "la" : "el";
}

export function buyMessage(p: Product) {
  const id = `${article(p.name)} ${p.name} (ref. ${p.ref})`;
  return isAvailable(p)
    ? `¡Hola! Me gustaría comprar ${id}. ¿Sigue disponible y cómo podemos gestionarlo?`
    : `¡Hola! He visto ${id} y me gustaría encargarlo con las telas y materiales que tengas disponibles ahora. ¿Cómo lo gestionaríamos?`;
}

export function customizeMessage(p: Product) {
  return `¡Hola! Me gustaría personalizar ${article(p.name)} ${p.name} (ref. ${p.ref}). ¿Podrías decirme qué opciones de telas, colores o medidas tienes disponibles?`;
}
