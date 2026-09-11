import type { Category } from "./categories";
export type Recommendation = { id:string; group_id:string; user_id:string; url:string; title:string; image_url:string|null; description:string|null; source_name:string|null; source_domain:string|null; category:Category; comment:string|null; created_at:string; profiles?:{ first_name:string }|null };
export type Group = { id:string; name:string; invite_code:string; created_by:string };
