"use client";

import { useMemo, useState } from "react";
import QRCode from "qrcode";
import { blueBasketCategories } from "@/lib/blue-basket-data";
import { createClient } from "@/lib/supabase/client";
import type { Category, Menu, Product } from "@/lib/types";
import { categorySchema, menuSchema, productSchema } from "@/lib/validation";

type EditableMenu = Menu | null;

const blankProduct = (categoryId: string, position: number): Omit<Product, "id"> => ({
  category_id: categoryId, name: "New item", description: null, price: 0, press_price: "", wash_press_price: "", dry_clean_price: "", label: null, position, is_available: true,
});

export function AdminEditor({ initialMenu }: { initialMenu: EditableMenu }) {
  const [menu, setMenu] = useState<EditableMenu>(initialMenu);
  const [status, setStatus] = useState("");
  const supabase = createClient();
  const publicUrl = useMemo(() => menu ? `${process.env.NEXT_PUBLIC_SITE_URL ?? location.origin}/menu/${menu.slug}` : "", [menu]);
  const replaceCategory = (next: Category) => menu && setMenu({ ...menu, categories: menu.categories.map((category) => category.id === next.id ? next : category) });

  async function setupBlueBasket() {
    setStatus("Creating the Blue Basket price list...");
    const { data: created, error } = await supabase.from("menus").insert({ business_name: "BLUE BASKET LAUNDRY", slug: "blue-basket-laundry", accent_color: "#2688d5", logo_url: "/blue-basket/logo_BB.png" }).select("id,slug,business_name,logo_url,accent_color,is_published").single();
    if (error || !created) return setStatus(error?.message ?? "Could not create the menu.");
    const { data: categories, error: categoryError } = await supabase.from("categories").insert(blueBasketCategories.map((category, position) => ({ menu_id: created.id, name: category.name, position }))).select();
    if (categoryError || !categories) return setStatus(categoryError?.message ?? "Menu created, but categories could not be added.");
    const products = categories.flatMap((category, index) => blueBasketCategories[index].rows.map((row, position) => ({ category_id: category.id, name: row.name, price: 0, press_price: row.press, wash_press_price: row.washPress, dry_clean_price: row.dryClean, position, is_available: true })));
    const { data: savedProducts, error: productError } = await supabase.from("products").insert(products).select();
    if (productError) return setStatus(productError.message);
    setMenu({ ...created, categories: categories.map((category) => ({ ...category, products: (savedProducts ?? []).filter((product) => product.category_id === category.id) })) });
    setStatus("Price list created. Review it, then publish when ready.");
  }

  async function save() {
    if (!menu) return;
    const parsed = menuSchema.safeParse(menu);
    if (!parsed.success) return setStatus(parsed.error.issues[0].message);
    const { error } = await supabase.from("menus").update(parsed.data).eq("id", menu.id);
    setStatus(error?.message ?? "Draft saved.");
  }

  async function publish() {
    if (!menu) return;
    const parsed = menuSchema.safeParse(menu);
    if (!parsed.success) return setStatus(parsed.error.issues[0].message);
    const { error } = await supabase.from("menus").update({ ...parsed.data, is_published: true, published_at: new Date().toISOString() }).eq("id", menu.id);
    if (!error) setMenu({ ...menu, is_published: true });
    setStatus(error?.message ?? "Published. The public menu and PDF now use these prices.");
  }

  async function addCategory() {
    if (!menu) return;
    const name = prompt("Category name?");
    const parsed = categorySchema.safeParse({ name });
    if (!parsed.success) return setStatus("Enter a category name.");
    const { data, error } = await supabase.from("categories").insert({ menu_id: menu.id, name: parsed.data.name, position: menu.categories.length }).select().single();
    if (error) return setStatus(error.message);
    setMenu({ ...menu, categories: [...menu.categories, { ...data, products: [] }] });
  }

  async function updateCategory(category: Category, name: string) {
    const parsed = categorySchema.safeParse({ name, description: category.description });
    if (!parsed.success) return setStatus(parsed.error.issues[0].message);
    const { error } = await supabase.from("categories").update(parsed.data).eq("id", category.id);
    setStatus(error?.message ?? "Category saved.");
  }

  async function deleteCategory(id: string) {
    if (!menu || !confirm("Delete this category and all of its items?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (!error) setMenu({ ...menu, categories: menu.categories.filter((category) => category.id !== id) });
    setStatus(error?.message ?? "Category deleted.");
  }

  async function addProduct(category: Category) {
    const { data, error } = await supabase.from("products").insert(blankProduct(category.id, category.products.length)).select().single();
    if (error) return setStatus(error.message);
    replaceCategory({ ...category, products: [...category.products, data] });
  }

  async function updateProduct(category: Category, product: Product) {
    const parsed = productSchema.safeParse(product);
    if (!parsed.success) return setStatus(parsed.error.issues[0].message);
    const { error } = await supabase.from("products").update(parsed.data).eq("id", product.id);
    setStatus(error?.message ?? "Item saved.");
  }

  async function deleteProduct(category: Category, id: string) {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) replaceCategory({ ...category, products: category.products.filter((product) => product.id !== id) });
    setStatus(error?.message ?? "Item deleted.");
  }

  async function downloadQr() {
    const uri = await QRCode.toDataURL(publicUrl, { width: 1000, margin: 1, color: { dark: "#17165e", light: "#ffffff" } });
    const link = document.createElement("a");
    link.href = uri;
    link.download = "blue-basket-menu-qr.png";
    link.click();
  }

  if (!menu) return <main className="grid min-h-screen place-items-center bg-[#f4f8fc] p-6 text-[#17165e]"><section className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-[0_18px_50px_rgba(23,22,94,0.12)]"><img src="/blue-basket/logo_BB.png" alt="Blue Basket Laundry" className="mx-auto h-20 w-56 object-contain" /><h1 className="mt-7 text-2xl font-black tracking-tight">Set up your price list</h1><p className="mt-3 text-sm leading-6 text-slate-600">Load the supplied Men, Ladies, and General services, then make any price changes before publishing.</p><button onClick={setupBlueBasket} className="mt-7 rounded-xl bg-[#2688d5] px-5 py-3 text-sm font-bold text-white shadow-sm">Create Blue Basket menu</button>{status && <p className="mt-4 text-sm text-slate-600">{status}</p>}</section></main>;

  return <main className="min-h-screen bg-[#f4f8fc] text-[#17165e]"><header className="border-b border-[#dce9f5] bg-white"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5 px-5 py-5 sm:px-8"><div className="flex items-center gap-4"><img src="/blue-basket/logo_BB.png" alt="Blue Basket Laundry" className="h-12 w-36 object-contain object-left" /><div className="border-l border-slate-200 pl-4"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2688d5]">Admin</p><h1 className="mt-1 text-lg font-black">Price list</h1></div></div><div className="flex flex-wrap gap-2"><button onClick={save} className="rounded-lg border border-[#cbddec] bg-white px-4 py-2.5 text-sm font-bold">Save draft</button><button onClick={publish} className="rounded-lg bg-[#17165e] px-4 py-2.5 text-sm font-bold text-white">{menu.is_published ? "Publish updates" : "Publish menu"}</button></div></div></header><div className="mx-auto max-w-6xl px-5 py-8 sm:px-8"><section className="flex flex-col gap-5 rounded-2xl border border-[#dce9f5] bg-white p-5 shadow-sm sm:flex-row sm:items-end sm:justify-between"><label className="block max-w-md flex-1 text-sm font-bold">Business name<input value={menu.business_name} onChange={(event) => setMenu({ ...menu, business_name: event.target.value })} className="mt-2 h-11 w-full rounded-lg border border-[#cbddec] px-3 font-medium outline-none focus:border-[#2688d5] focus:ring-2 focus:ring-[#2688d5]/20" /></label><div className="flex flex-wrap gap-2"><a href={publicUrl} target="_blank" className="rounded-lg border border-[#cbddec] px-4 py-2.5 text-sm font-bold">View public menu</a><button onClick={downloadQr} className="rounded-lg border border-[#cbddec] px-4 py-2.5 text-sm font-bold">Download QR</button><a href={menu.is_published ? `/api/menu/${menu.slug}/pdf` : undefined} aria-disabled={!menu.is_published} className={`rounded-lg px-4 py-2.5 text-sm font-bold text-white ${menu.is_published ? "bg-[#2688d5]" : "pointer-events-none bg-slate-300"}`}>Download PDF</a></div></section>{!menu.is_published && <p className="mt-3 text-sm text-slate-500">Publish the menu to enable its public link and PDF download.</p>}{status && <p aria-live="polite" className="mt-4 rounded-lg bg-[#e8f4fc] px-4 py-3 text-sm font-medium text-[#155e99]">{status}</p>}<section className="mt-8 space-y-5"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2688d5]">Services</p><h2 className="mt-1 text-2xl font-black tracking-tight">Categories and pricing</h2></div><button onClick={addCategory} className="rounded-lg bg-[#2688d5] px-4 py-2.5 text-sm font-bold text-white">Add category</button></div>{menu.categories.map((category) => <article key={category.id} className="overflow-hidden rounded-2xl border border-[#dce9f5] bg-white shadow-sm"><div className="flex flex-wrap items-center gap-3 border-b border-[#dce9f5] px-5 py-4"><input defaultValue={category.name} onBlur={(event) => updateCategory(category, event.target.value)} aria-label="Category name" className="min-w-0 flex-1 bg-transparent text-lg font-black uppercase tracking-wide outline-none" /><button onClick={() => deleteCategory(category.id)} className="text-sm font-bold text-rose-600">Delete category</button></div><div className="overflow-x-auto"><div className="min-w-[680px]"><div className="grid grid-cols-[minmax(220px,1fr)_100px_120px_100px_42px] gap-3 border-b border-[#dce9f5] bg-[#f2f8fd] px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#3977a5]"><span>Item</span><span className="text-center">Press</span><span className="text-center">Wash &amp; Press</span><span className="text-center">Dry Clean</span><span /></div>{category.products.map((product, index) => <div key={product.id} className={`grid grid-cols-[minmax(220px,1fr)_100px_120px_100px_42px] items-center gap-3 px-5 py-2.5 ${index % 2 === 0 ? "bg-white" : "bg-[#fbfdff]"}`}><input defaultValue={product.name} onBlur={(event) => updateProduct(category, { ...product, name: event.target.value })} aria-label="Item name" className="min-w-0 border-b border-transparent bg-transparent py-1 font-semibold outline-none focus:border-[#2688d5]" /><PriceInput label="Press price" value={product.press_price} onBlur={(press_price) => updateProduct(category, { ...product, press_price })} /><PriceInput label="Wash and press price" value={product.wash_press_price} onBlur={(wash_press_price) => updateProduct(category, { ...product, wash_press_price })} /><PriceInput label="Dry clean price" value={product.dry_clean_price} onBlur={(dry_clean_price) => updateProduct(category, { ...product, dry_clean_price })} /><button onClick={() => deleteProduct(category, product.id)} aria-label={`Delete ${product.name}`} className="text-lg font-medium text-slate-400 hover:text-rose-600">×</button></div>)}</div></div><div className="border-t border-[#dce9f5] px-5 py-3"><button onClick={() => addProduct(category)} className="text-sm font-bold text-[#2688d5]">+ Add item</button></div></article>)}</section></div></main>;
}

function PriceInput({ label, value, onBlur }: { label: string; value: string | null; onBlur: (value: string | null) => void }) {
  return <input defaultValue={value ?? ""} onBlur={(event) => onBlur(event.target.value || null)} aria-label={label} className="min-w-0 border-b border-transparent bg-transparent py-1 text-center font-semibold tabular-nums outline-none focus:border-[#2688d5]" />;
}
