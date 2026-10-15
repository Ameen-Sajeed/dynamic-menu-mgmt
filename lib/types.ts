export type Product = { id: string; category_id: string; name: string; description: string | null; price: number; label: string | null; position: number; is_available: boolean };
export type Category = { id: string; menu_id: string; name: string; description: string | null; position: number; products: Product[] };
export type Menu = { id: string; slug: string; business_name: string; logo_url: string | null; accent_color: string; is_published: boolean; categories: Category[] };
export type MenuSize = "a4" | "flyer" | "brochure";
