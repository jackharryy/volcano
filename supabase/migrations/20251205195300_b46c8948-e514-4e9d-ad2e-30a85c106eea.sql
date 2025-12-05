-- Organizations table
create table if not exists public.organizations (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  invite_code text unique not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Teams table
create table if not exists public.teams (
  id uuid default gen_random_uuid() primary key,
  organization_id uuid references public.organizations(id) on delete cascade not null,
  name text not null,
  color text default '#3b82f6',
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  unique(organization_id, name)
);

-- Organization members table
create table if not exists public.organization_members (
  id uuid default gen_random_uuid() primary key,
  organization_id uuid references public.organizations(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null check (role in ('admin', 'member')) default 'member',
  joined_at timestamp with time zone default now() not null,
  unique(organization_id, user_id)
);

-- Team members table
create table if not exists public.team_members (
  id uuid default gen_random_uuid() primary key,
  team_id uuid references public.teams(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  joined_at timestamp with time zone default now() not null,
  unique(team_id, user_id)
);

-- Enable RLS
alter table public.organizations enable row level security;
alter table public.teams enable row level security;
alter table public.organization_members enable row level security;
alter table public.team_members enable row level security;

-- RLS Policies for organizations
create policy "Users can view organizations they are members of"
  on public.organizations for select
  using (
    exists (
      select 1 from public.organization_members
      where organization_members.organization_id = organizations.id
      and organization_members.user_id = auth.uid()
    )
  );

create policy "Users can create organizations"
  on public.organizations for insert
  with check (auth.uid() is not null);

-- RLS Policies for organization_members
create policy "Users can view members of their organizations"
  on public.organization_members for select
  using (
    exists (
      select 1 from public.organization_members om
      where om.organization_id = organization_members.organization_id
      and om.user_id = auth.uid()
    )
  );

create policy "Users can join organizations"
  on public.organization_members for insert
  with check (auth.uid() is not null);

-- RLS Policies for teams
create policy "Users can view teams of their organizations"
  on public.teams for select
  using (
    exists (
      select 1 from public.organization_members
      where organization_members.organization_id = teams.organization_id
      and organization_members.user_id = auth.uid()
    )
  );

-- RLS Policies for team_members
create policy "Users can view team members of their organizations"
  on public.team_members for select
  using (
    exists (
      select 1 from public.teams t
      join public.organization_members om on om.organization_id = t.organization_id
      where t.id = team_members.team_id
      and om.user_id = auth.uid()
    )
  );

-- Function to add creator as admin
create or replace function add_creator_as_admin()
returns trigger as $$
begin
  insert into public.organization_members (organization_id, user_id, role)
  values (new.id, auth.uid(), 'admin');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_organization_created
  after insert on public.organizations
  for each row
  execute function add_creator_as_admin();