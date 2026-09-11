import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AddFlow } from "./add-flow";
export default async function AddPage(){const sb=await createClient();const {data:{user}}=await sb.auth.getUser();if(!user)redirect("/auth?next=/add");const {data}=await sb.from("group_members").select("group_id").eq("user_id",user.id).limit(1).single();if(!data)redirect("/");return <AddFlow groupId={data.group_id}/>}
