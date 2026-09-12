import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { createClient } from "@supabase/supabase-js";

const MAX_BYTES = 1_500_000;
const MAX_REDIRECTS = 3;

function privateIp(ip: string) {
  if (ip.includes(":")) {
    return (
      ip === "::1" ||
      ip.startsWith("fc") ||
      ip.startsWith("fd") ||
      ip.startsWith("fe80") ||
      ip.startsWith("::ffff:127.")
    );
  }
  const parts = ip.split(".").map(Number);
  return (
    parts[0] === 10 || parts[0] === 127 || parts[0] === 0 ||
    (parts[0] === 169 && parts[1] === 254) ||
    (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
    (parts[0] === 192 && parts[1] === 168) ||
    (parts[0] === 100 && parts[1] >= 64 && parts[1] <= 127)
  );
}

async function safeUrl(raw: string) {
  let url: URL;
  try { url = new URL(raw); } catch { throw new Error("Ce lien n’est pas valide."); }
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) {
    throw new Error("Seuls les liens HTTP et HTTPS sont acceptés.");
  }
  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || (isIP(host) && privateIp(host))) {
    throw new Error("Cette adresse n’est pas autorisée.");
  }
  let addresses;
  try { addresses = await lookup(host, { all: true }); } catch { throw new Error("Ce site est introuvable."); }
  if (!addresses.length || addresses.some((address) => privateIp(address.address))) {
    throw new Error("Cette adresse n’est pas autorisée.");
  }
  return url;
}

function decode(value: string) {
  return value
    .replace(/&amp;/gi, "&").replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&#(\d+);/g, (_, number) => String.fromCharCode(Number(number))).trim();
}

function meta(html: string, key: string) {
  const tags = html.match(/<meta\s+[^>]*>/gi) || [];
  for (const tag of tags) {
    const attrs: Record<string, string> = {};
    tag.replace(/([\w:-]+)\s*=\s*["']([^"']*)["']/g, (_, name, value) => { attrs[name.toLowerCase()] = value; return ""; });
    if ((attrs.property || attrs.name)?.toLowerCase() === key.toLowerCase()) return decode(attrs.content || "");
  }
  return "";
}

async function fetchPage(initial: URL) {
  let url = initial;
  for (let index = 0; index <= MAX_REDIRECTS; index += 1) {
    url = await safeUrl(url.toString());
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 7000);
    let response: Response;
    try {
      response = await fetch(url, { redirect: "manual", signal: controller.signal, headers: { "user-agent": "Mozilla/5.0 (compatible; LesGirlsBot/1.0)", accept: "text/html,application/xhtml+xml" } });
    } finally { clearTimeout(timer); }
    if (response.status >= 300 && response.status < 400 && response.headers.get("location")) {
      url = new URL(response.headers.get("location")!, url); continue;
    }
    if (!response.ok) throw new Error("Ce site ne répond pas.");
    if (!(response.headers.get("content-type") || "").toLowerCase().includes("text/html")) throw new Error("Ce lien ne pointe pas vers une page web.");
    const declared = Number(response.headers.get("content-length") || 0);
    if (declared > MAX_BYTES) throw new Error("Cette page est trop volumineuse.");
    const reader = response.body?.getReader();
    if (!reader) throw new Error("Contenu inaccessible.");
    let total = 0; const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      total += value.length;
      if (total > MAX_BYTES) { await reader.cancel(); throw new Error("Cette page est trop volumineuse."); }
      chunks.push(value);
    }
    const merged = new Uint8Array(total); let offset = 0;
    for (const chunk of chunks) { merged.set(chunk, offset); offset += chunk.length; }
    return { html: new TextDecoder().decode(merged), url };
  }
  throw new Error("Trop de redirections.");
}

async function authenticated(request: any) {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey) throw new Error("Supabase n’est pas configuré.");
  const header = request.headers?.authorization || request.headers?.Authorization || "";
  const token = typeof header === "string" && header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return false;
  const client = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await client.auth.getUser(token);
  return !error && Boolean(data.user);
}

export default async function handler(request: any, response: any) {
  if (request.method !== "POST") { response.setHeader("Allow", "POST"); return response.status(405).json({ error: "Méthode non autorisée." }); }
  try {
    if (!(await authenticated(request))) return response.status(401).json({ error: "Connexion requise." });
    const rawBody = typeof request.body === "string" ? JSON.parse(request.body) : request.body || {};
    const initial = await safeUrl(String(rawBody.url || ""));
    const { html, url } = await fetchPage(initial);
    const title = meta(html, "og:title") || meta(html, "twitter:title") || decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
    const image = meta(html, "og:image") || meta(html, "twitter:image") || meta(html, "twitter:image:src");
    const imageUrl = image ? new URL(image, url).toString() : "";
    return response.status(200).json({
      url: url.toString(), title: title.slice(0, 300), imageUrl,
      description: (meta(html, "og:description") || meta(html, "twitter:description") || meta(html, "description")).slice(0, 1000),
      sourceName: (meta(html, "og:site_name") || url.hostname.replace(/^www\./, "")).slice(0, 120),
      sourceDomain: url.hostname.replace(/^www\./, ""),
    });
  } catch (error) {
    return response.status(400).json({ error: error instanceof Error ? error.message : "Impossible d’analyser ce lien." });
  }
}
