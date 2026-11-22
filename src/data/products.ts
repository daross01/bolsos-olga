import productsCsv from "./productos.csv?raw";
import photoPaths from "virtual:catalog-photos";
// Catálogo centralizado. Para añadir, editar o eliminar un producto, modifica esta lista.
// Para usar tu foto real, rellena "image" con la URL de la imagen; vacío = imagen provisional.
export type Category = "bolsos" | "neceseres" | "complementos";
export type Availability = "disponible" | "vendido" | "no-disponible";

export interface Product {
  ref: string;
  name: string;
  category: Category;
  price: number;
  description: string;
  availability: Availability;
  image?: string;
  visible?: boolean;
  photoFolder?: string;
  images?: string[];
}

export const categories: { id: Category | "todo"; label: string }[] = [
  { id: "todo", label: "Todo" },
  { id: "bolsos", label: "Bolsos" },
  { id: "neceseres", label: "Neceseres" },
  { id: "complementos", label: "Otros complementos" },
];

const desc = "Pieza hecha a mano. Descripción provisional: añade aquí medidas, telas y detalles.";

// Fotos estáticas en public/productos. Todas en .jpg y en minúsculas.
const photos: Record<string, string> = {
  "A001": "/productos/a001.jpg",
  "B001": "/productos/b001.jpg",
  "B002": "/productos/b002.jpg",
  "B003": "/productos/b003.jpg",
  "B004": "/productos/b004.jpg",
  "B005": "/productos/b005.jpg",
  "B006": "/productos/b006.jpg",
  "B007": "/productos/b007.jpg",
  "B008": "/productos/b008.jpg",
  "B009": "/productos/b009.jpg",
  "B010": "/productos/b010.jpg",
  "B011": "/productos/b011.jpg",
  "N002": "/productos/n002.jpg",
  "N003": "/productos/n003.jpg",
  "N004": "/productos/n004.jpg",
  "N005": "/productos/n005.jpg",
  "N008": "/productos/n008.jpg",
  "N009": "/productos/n009.jpg",
};

const p = (ref: string, name: string, category: Category, price: number, description = desc): Product => ({
  ref, name, category, price, description, availability: "disponible", image: photos[ref] ?? "",
});

const baseProducts: Product[] = [
  p("B001", "Bolso tote patchwork teja y beige", "bolsos", 32),
  p("B002", "Bolso tote marrón de textura suave", "bolsos", 35),
  p("B003", "Bolso tote geométrico amarillo y negro", "bolsos", 32),
  p("B004", "Bolso bandolera rojo/burdeos con flecos", "bolsos", 35),
  p("B005", "Bolso bandolera beige con detalle turquesa", "bolsos", 29),
  p("B006", "Bolso tote Mickey y Minnie", "bolsos", 29),
  p("B007", "Bolso bandolera negro con cadena", "bolsos", 28),
  p("B008", "Bolso bandolera patchwork negro y teja", "bolsos", 30),
  p("B009", "Bolso tote negro con asas estampadas", "bolsos", 35),
  p("B010", "Bolso tote marrón chocolate", "bolsos", 35,
    "Bolso tote artesanal en un elegante tono marrón chocolate, con asas largas para llevar cómodamente al hombro. Su diseño sencillo y atemporal se completa con un delicado colgante de borlas y abalorios en tonos crema y dorado, que le aporta un toque especial y original."),
  p("B011", "Mochila mostaza con estampado étnico", "bolsos", 39,
    "Mochila de tela en color mostaza con una franja frontal decorativa de estampado multicolor de inspiración bohemia, asa superior estampada y tirantes negros."),
  p("A001", "Estuche vertical azul con botón de madera", "complementos", 15,
    "Estuche textil de formato vertical confeccionado con tejido estampado floral en tonos azul grisáceo y beige, con cierre mediante botón de madera natural y presilla."),
  p("N002", "Neceser estampado morado pequeño", "neceseres", 12),
  p("N003", "Neceser estampado morado grande", "neceseres", 15),
  p("N004", "Neceser teja con adorno de lazo", "neceseres", 17),
  p("N005", "Neceser patchwork beige y teja", "neceseres", 17),
  p("N008", "Neceser beige con lazos fucsia", "neceseres", 13),
  p("N009", "Neceser lila de forma cúbica", "neceseres", 16,
    "Neceser confeccionado en tela lisa de color lila, con una original estructura tridimensional de forma cúbica que le proporciona volumen y capacidad interior. Cierre de cremallera superior."),
];

// All editable catalog settings come from the CSV; blanks preserve existing defaults.
export function applyCatalogCsv(base: Product[], csv: string, paths: string[] = []): Product[] {
  const [header = "", ...lines] = csv.trim().split(/\r?\n/);
  const columns = header.replace(/^\uFEFF/, "").split(";").map((cell) => cell.trim());
  const rows = new Map(lines.map((line) => {
    const cells = line.split(";").map((cell) => cell.trim());
    const row = Object.fromEntries(columns.map((column, index) => [column, cells[index] ?? ""]));
    return [row["ref"], row] as const;
  }));
  const isNo = (value: string | undefined) => value?.toLowerCase() === "no";
  return base.map((product) => {
    const row = rows.get(product.ref);
    const price = Number(row?.["precio"]?.replace(",", "."));
    const folder = (row?.["carpeta_fotos"] ?? "").replace(/^\/?(?:public\/)?productos\//, "").replace(/\/$/, "");
    const prefix = `/productos/${folder}/`;
    const images = [...new Set([
      ...(product.image ? [product.image] : []),
      ...(folder ? paths.filter((path) => path.startsWith(prefix) && !path.slice(prefix.length).includes("/")) : []),
    ])];
    return {
      ...product,
      name: row?.["nombre"] || product.name,
      price: Number.isFinite(price) && price > 0 ? price : product.price,
      availability: isNo(row?.["disponible"]) ? "no-disponible" as const : product.availability,
      visible: !isNo(row?.["visible"]),
      photoFolder: folder,
      images,
    };
  }).filter((product) => product.visible);
}

export const products = applyCatalogCsv(baseProducts, productsCsv, photoPaths);

export const productSlug = (p: Product) =>
  `${p.ref.toLowerCase()}-${p.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;

export const findBySlug = (slug: string) =>
  products.find((p) => productSlug(p) === slug || p.ref.toLowerCase() === slug.split("-")[0]);

export const isAvailable = (p: Product) => p.availability === "disponible";

export const availabilityLabel: Record<Availability, string> = {
  disponible: "Disponible",
  vendido: "Vendido",
  "no-disponible": "No disponible",
};

export function getRecommendations(product: Product, max = 4): Product[] {
  return products.filter((x) => x.category === product.category && x.ref !== product.ref).slice(0, max);
}

export const formatPrice = (n: number) => `${n} €`;
