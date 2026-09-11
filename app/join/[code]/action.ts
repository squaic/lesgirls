"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
export async function joinGroup(code:string){const sb=await createClient();const {data:{user}}=await sb.auth.getUser();if(!user)redirect(`/auth?next=/join/${encodeURIComponent(code)}`);const {error}=await sb.rpc("join_group_by_invite",{code});if(error)throw new Error(error.message);redirect("/")}
