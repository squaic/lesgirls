"use client";

import { useState } from "react";
import Link from "next/link";
import { CATEGORIES, CATEGORY_LABELS } from "@/lib/categories";
import { saveRecommendation } from "@/app/actions";

type Meta = {
  url: string;
  title: string;
  imageUrl: string;
  description: string;
  sourceName: string;
  sourceDomain: string;
};

const EMPTY_META: Meta = {
  url: "",
  title: "",
  imageUrl: "",
  description: "",
  sourceName: "",
  sourceDomain: "",
};

const ICONS: Record<string, React.ReactNode> = {
  books: <span className="text-2xl">▯</span>,
  films: <span className="text-2xl">▦</span>,
  series: <span className="text-2xl">▣</span>,
  places: <span className="text-2xl">⌖</span>,
};

export function AddFlow({ groupId }: { groupId: string }) {
  const [url, setUrl] = useState("");
  const [meta, setMeta] = useState<Meta>(EMPTY_META);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function analyze() {
    if (!url.trim()) {
      setMeta((m) => ({ ...m, url: "" }));
      return;
    }

    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/metadata", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setMeta(d);
    } catch (e) {
      let sourceDomain = "";
      try {
        sourceDomain = new URL(url).hostname.replace(/^www\./, "");
      } catch {}
      setMeta({ ...EMPTY_META, url, sourceDomain });
      setError(e instanceof Error ? e.message : "Extraction impossible. Complète les informations.");
    } finally {
      setBusy(false);
    }
  }

  async function publish(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);

    try {
      if (url && !meta.url) await analyze();
      await saveRecommendation({
        groupId,
        url: meta.url || url || "",
        title: String(f.get("title")),
        imageUrl: String(f.get("imageUrl") || meta.imageUrl || ""),
        description: meta.description || "",
        sourceName: meta.sourceName || "",
        sourceDomain: meta.sourceDomain || "",
        category: String(f.get("category")),
        comment: String(f.get("comment")),
      });
      location.href = "/";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Impossible de publier");
      setBusy(false);
    }
  }

  return (
    <main className="shell flex min-h-dvh flex-col bg-white text-[#423234]">
      <header className="grid grid-cols-[40px_1fr_40px] items-center border-b border-[#eee8e2] px-5 py-5">
        <Link href="/" aria-label="Fermer" className="text-[30px] font-light leading-none text-[#8f8581]">×</Link>
        <h1 className="serif text-center text-[24px]">Nouveau partage</h1>
        <span />
      </header>

      <form onSubmit={publish} className="flex flex-1 flex-col px-6 pb-6 pt-8">
        <div>
          <label className="label">Coller un lien</label>
          <div className="flex min-h-[54px] items-center gap-3 rounded-[14px] bg-[#f7f3ed] px-4">
            <span className="text-lg text-[#aaa09c]">↗</span>
            <input
              className="min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-[#aaa09c]"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={analyze}
              placeholder="https://..."
              aria-label="Coller un lien"
            />
          </div>
          <p className="mt-3 text-[13px] leading-5 text-[#aaa09c]">
            On récupère le titre et l&apos;image pour vous — ou continuez à la main.
          </p>
        </div>

        <fieldset className="mt-8">
          <legend className="label">Catégorie</legend>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map((c) => (
              <label key={c} className="cursor-pointer">
                <input className="peer sr-only" type="radio" name="category" value={c} required />
                <span className="flex min-h-[82px] flex-col items-center justify-center gap-2 rounded-[12px] border border-[#eee8e2] text-[12px] text-[#9f9591] peer-checked:border-[#423234] peer-checked:text-[#423234]">
                  {ICONS[c]}
                  {CATEGORY_LABELS[c].replace(/s$/, "")}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-8">
          <label className="label">Titre</label>
          <input
            className="field"
            name="title"
            required
            defaultValue={meta.title}
            key={meta.title}
            placeholder="Le nom du livre, film, lieu..."
          />
        </div>

        <input type="hidden" name="imageUrl" value={meta.imageUrl} />

        <div className="mt-8">
          <label className="label">Un mot (optionnel)</label>
          <textarea className="field" name="comment" placeholder="Pourquoi vous avez aimé..." />
        </div>

        {error && <p className="error mt-4">{error}</p>}

        <button disabled={busy} className="btn btn-primary mt-auto pt-0">
          {busy ? "Partage…" : "Partager"}
        </button>
      </form>
    </main>
  );
}
