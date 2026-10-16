import Link from "next/link";

export default function Home() {
  return <main className="grid min-h-screen place-items-center bg-[#f4f8fc] p-6 text-[#17165e]">
    <section className="w-full max-w-lg rounded-3xl bg-white p-9 text-center shadow-[0_18px_50px_rgba(23,22,94,0.12)] sm:p-12">
      <img src="/blue-basket/logo_BB.png" alt="Blue Basket Laundry" className="mx-auto h-20 w-64 object-contain" />
      <p className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-[#2688d5]">Menu management</p>
      <h1 className="mt-3 text-3xl font-black tracking-tight">Keep your price list current.</h1>
      <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-slate-600">Manage services and pricing, publish a responsive customer menu, and download a print-ready PDF from one place.</p>
      <Link className="mt-8 inline-block rounded-xl bg-[#17165e] px-5 py-3 text-sm font-bold text-white" href="/admin">Open price list</Link>
    </section>
  </main>;
}
