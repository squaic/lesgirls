import { notFound,redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditForm } from "./edit-form";
import type { Recommendation } from "@/lib/types";
export default async function EditPage({params}:{params:Promise<{id:string}>}){const {id}=await params;const sb=await createClient();const {data:{user}}=await sb.auth.getUser();if(!user)redirect("/auth");const {data}=await sb.from("recommendations").select("*").eq("id",id).single();if(!data||data.user_id!==user.id)notFound();return <EditForm item={data as Recommendation}/>}
