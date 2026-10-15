import { z } from "zod";
export const productSchema = z.object({ name: z.string().trim().min(1).max(100), description: z.string().trim().max(300).nullable().optional(), price: z.coerce.number().min(0).max(100000), label: z.string().trim().max(40).nullable().optional(), is_available: z.boolean().default(true) });
export const categorySchema = z.object({ name: z.string().trim().min(1).max(80), description: z.string().trim().max(200).nullable().optional() });
export const menuSchema = z.object({ business_name: z.string().trim().min(1).max(100), accent_color: z.string().regex(/^#[0-9a-fA-F]{6}$/), logo_url: z.string().url().nullable().optional() });
