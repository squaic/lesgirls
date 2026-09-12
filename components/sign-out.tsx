"use client";
import { createClient } from "@/lib/supabase/client";
export function SignOut(){return <button className="text-sm text-[var(--muted)] underline" onClick={async()=>{await createClient().auth.signOut();location.href="/auth"}}>Se déconnecter</button>}
