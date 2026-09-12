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

export function AddFlow({ groupId }: { groupId: string }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [url, setUrl] = useState("");
  const [meta, setMeta] = useState<Meta | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function analyze(e: React.FormEvent) {
    e.preventDefault();
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
      setStep(2);
    } catch (e) {
      let sourceDomain = "";
      try {
        sourceDomain = new URL(url).hostname.replace(/^www\./, "");
      } catch {}
      setMeta({ ...EMPTY_META, url, sourceDomain });
      setStep(2);
      setError(
        e instanceof Error
          ? e.message
          : "Extraction impossible. Complète les informations."
      );
    } finally {
      setBusy(false);
    }
  }

  function skipLink() {
    setError("");
    setMeta(EMPTY_META);
    setStep(2);
  }

  async function publish(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);

    try {
      await saveRecommendation({
        groupId,
        url: meta?.url || "",
        title: String(f.get("title")),
        imageUrl: String(f.get("imageUrl")),
        description: meta?.description || "",
        sourceName: meta?.sourceName || "",
        sourceDomain: meta?.sourceDomain || "",
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
    <main className="shell min-h-dvh px-5 py-7">
      <header className="flex items-center justify-between">
        <Link
          href={step === 2 ? "#" : "/"}
          onClick={(e) => {
            if (step === 2) {
              e.preventDefault();
              setStep(1);
              setError("");
            }
          }}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eadfd9]"
        >
          ←
        </Link>
        <span className="text-sm font-bold">Ajouter un bon plan</span>
        <span className="w-10" />
      </header>

      {step === 1 ? (
        <section className="pt-16">
          <span className="text-xs font-bold uppercase tracking-[.16em] text-[#e84b72]">
            Étape 1 sur 2
          </span>
          <h1 className="serif mt-3 text-4xl font-bold leading-tight">Colle ton lien</h1>
          <p className="mt-3 text-sm leading-6 text-[#806f71]">
            Si tu en as un, on essaie de récupérer le titre et l’image automatiquement.
          </p>

          <form onSubmit={analyze} className="mt-9">
            <label className="label">Lien du bon plan</label>
            <div className="relative">
              <span className="absolute left-4 top-[15px] text-[#a18d89]">↗</span>
              <input
                className="field pl-11"
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://…"
              />
            </div>
            <button disabled={busy} className="btn btn-primary mt-5">
              {busy ? "On regarde le lien…" : "Continuer  →"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[.12em] text-[#b7a5a0]">
            <span className="h-px flex-1 bg-[#eadfd9]" />
            ou
            <span className="h-px flex-1 bg-[#eadfd9]" />
          </div>

          <button type="button" onClick={skipLink} className="btn w-full border border-[#eadfd9] bg-white">
            Ajouter sans lien
          </button>
        </section>
      ) : (
        <section className="pt-9">
          <span className="text-xs font-bold uppercase tracking-[.16em] text-[#e84b72]">
            Étape 2 sur 2
          </span>
          <h1 className="serif mt-3 text-3xl font-bold">Un dernier coup d’œil</h1>
          <p className="mt-2 text-sm text-[#806f71]">Ajuste les détails avant de le partager.</p>
          {error && <p className="error mt-4">{error}</p>}

          <form onSubmit={publish} className="mt-7 space-y-5">
            <div>
              <label className="label">Titre *</label>
              <input
                className="field"
                name="title"
                required
                defaultValue={meta?.title}
                placeholder="Le nom du film, du lieu…"
              />
            </div>
            <div>
              <label className="label">
                Image <span className="font-normal text-[#a18d89]">(facultatif)</span>
              </label>
              <input
                className="field"
                name="imageUrl"
                type="url"
                defaultValue={meta?.imageUrl}
                placeholder="https://…"
              />
            </div>
            <fieldset>
              <legend className="label">Catégorie *</legend>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((c) => (
                  <label key={c} className="cursor-pointer">
                    <input className="peer sr-only" type="radio" name="category" value={c} required />
                    <span className="flex min-h-12 items-center justify-center rounded-xl border border-[#eadfd9] px-2 text-center text-sm font-bold peer-checked:border-[#e84b72] peer-checked:bg-[#fce7ec] peer-checked:text-[#d93c63]">
                      {CATEGORY_LABELS[c]}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div>
              <label className="label">
                Ton commentaire <span className="font-normal text-[#a18d89]">(facultatif)</span>
              </label>
              <textarea className="field" name="comment" placeholder="Pourquoi tu le partages ?" />
            </div>
            <button disabled={busy} className="btn btn-primary">
              {busy ? "Publication…" : "Ajouter aux bons plans  ♥"}
            </button>
          </form>
        </section>
      )}
    </main>
  );
}
