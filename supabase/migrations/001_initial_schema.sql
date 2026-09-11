create extension if not exists pgcrypto;
create type public.group_role as enum ('owner', 'member');
create type public.recommendation_category as enum ('films', 'series', 'books', 'places');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null check (char_length(first_name) between 1 and 80),
  created_at timestamptz not null default now()
);
create table public.groups (
  id uuid primary key default gen_random_uuid(), name text not null check (char_length(name) between 1 and 80),
  invite_code text not null unique check (char_length(invite_code) >= 20), created_by uuid not null references auth.users(id), created_at timestamptz not null default now()
);
create table public.group_members (
  group_id uuid not null references public.groups(id) on delete cascade, user_id uuid not null references auth.users(id) on delete cascade,
  role public.group_role not null default 'member', joined_at timestamptz not null default now(), primary key(group_id,user_id)
);
create table public.recommendations (
  id uuid primary key default gen_random_uuid(), group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade, url text not null, title text not null check (char_length(title) between 1 and 300),
  image_url text, description text, source_name text, source_domain text, category public.recommendation_category not null, comment text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index recommendations_group_created_idx on public.recommendations(group_id, created_at desc);
create index recommendations_group_category_idx on public.recommendations(group_id, category);
create index group_members_user_idx on public.group_members(user_id);

create function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin insert into public.profiles(id,first_name) values(new.id,coalesce(nullif(trim(new.raw_user_meta_data->>'first_name'),''),'Girlz')); return new; end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
create function public.touch_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;
create trigger recommendations_updated before update on public.recommendations for each row execute procedure public.touch_updated_at();

-- SECURITY DEFINER avoids recursive RLS checks while testing membership.
create function public.is_group_member(gid uuid) returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.group_members where group_id=gid and user_id=auth.uid())
$$;
revoke all on function public.is_group_member(uuid) from public; grant execute on function public.is_group_member(uuid) to authenticated;
create function public.shares_group(other_user uuid) returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.group_members mine join public.group_members theirs using(group_id) where mine.user_id=auth.uid() and theirs.user_id=other_user)
$$;
revoke all on function public.shares_group(uuid) from public; grant execute on function public.shares_group(uuid) to authenticated;
create function public.invited_group(code text) returns table(id uuid,name text) language sql stable security definer set search_path=public as $$
  select groups.id,groups.name from public.groups where invite_code=code and auth.uid() is not null
$$;
revoke all on function public.invited_group(text) from public; grant execute on function public.invited_group(text) to authenticated;
create function public.join_group_by_invite(code text) returns uuid language plpgsql security definer set search_path=public as $$
declare gid uuid; begin select id into gid from public.groups where invite_code=code; if gid is null then raise exception 'Invitation introuvable'; end if;
insert into public.group_members(group_id,user_id,role) values(gid,auth.uid(),'member') on conflict do nothing; return gid; end $$;
revoke all on function public.join_group_by_invite(text) from public; grant execute on function public.join_group_by_invite(text) to authenticated;

alter table public.profiles enable row level security; alter table public.groups enable row level security;
alter table public.group_members enable row level security; alter table public.recommendations enable row level security;
create policy "profiles shared groups read" on public.profiles for select to authenticated using (id=auth.uid() or public.shares_group(id));
create policy "profile owner update" on public.profiles for update to authenticated using(id=auth.uid()) with check(id=auth.uid());
create policy "members read groups" on public.groups for select to authenticated using(public.is_group_member(id) or created_by=auth.uid());
create policy "users create groups" on public.groups for insert to authenticated with check(created_by=auth.uid());
create policy "owners update groups" on public.groups for update to authenticated using(created_by=auth.uid()) with check(created_by=auth.uid());
create policy "members read memberships" on public.group_members for select to authenticated using(public.is_group_member(group_id));
create policy "creator adds owner membership" on public.group_members for insert to authenticated with check(user_id=auth.uid() and role='owner' and exists(select 1 from public.groups where id=group_id and created_by=auth.uid()));
create policy "members read recommendations" on public.recommendations for select to authenticated using(public.is_group_member(group_id));
create policy "members add recommendations" on public.recommendations for insert to authenticated with check(user_id=auth.uid() and public.is_group_member(group_id));
create policy "authors update recommendations" on public.recommendations for update to authenticated using(user_id=auth.uid() and public.is_group_member(group_id)) with check(user_id=auth.uid() and public.is_group_member(group_id));
create policy "authors delete recommendations" on public.recommendations for delete to authenticated using(user_id=auth.uid() and public.is_group_member(group_id));
