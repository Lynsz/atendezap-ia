export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16">
      <section className="mx-auto max-w-6xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm" role="status" aria-live="polite">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">AtendeZap IA</p>
        <h1 className="mt-3 text-2xl font-black text-ink">Carregando...</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Preparando a tela sem expor dados sensiveis.</p>
      </section>
    </main>
  );
}
