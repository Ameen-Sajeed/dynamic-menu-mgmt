export type Product = { id: string; category_id: string; name: string; description: string | null; price: number; press_price: string | null; wash_press_price: string | null; dry_clean_price: string | null; label: string | null; position: number; is_available: boolean };
export type Category = { id: string; menu_id: string; name: string; description: string | null; position: number; products: Product[] };
export type Menu = { id: string; slug: string; business_name: string; logo_url: string | null; accent_color: string; is_published: boolean; categories: Category[] };
