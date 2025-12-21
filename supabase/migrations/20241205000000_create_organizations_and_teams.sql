-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- Create organizations table
create table public.organizations (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  invite_code text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create teams table
create table public.teams (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references public.organizations(id) on delete cascade not null,
  name text not null,
  color text default '#3b82f6',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(organization_id, name)
);

-- Create organization_members table (junction table for users and organizations)
create table public.organization_members (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references public.organizations(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null check (role in ('admin', 'member')) default 'member',
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(organization_id, user_id)
);

-- Create team_members table (junction table for users and teams)
create table public.team_members (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(team_id, user_id)
);

-- Create indexes for better query performance
create index idx_organizations_invite_code on public.organizations(invite_code);
create index idx_teams_organization_id on public.teams(organization_id);
create index idx_organization_members_org_id on public.organization_members(organization_id);
create index idx_organization_members_user_id on public.organization_members(user_id);
create index idx_team_members_team_id on public.team_members(team_id);
create index idx_team_members_user_id on public.team_members(user_id);

-- Enable Row Level Security
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

create policy "Admins can update their organizations"
  on public.organizations for update
  using (
    exists (
      select 1 from public.organization_members
      where organization_members.organization_id = organizations.id
      and organization_members.user_id = auth.uid()
      and organization_members.role = 'admin'
    )
  );

create policy "Admins can delete their organizations"
  on public.organizations for delete
  using (
    exists (
      select 1 from public.organization_members
      where organization_members.organization_id = organizations.id
      and organization_members.user_id = auth.uid()
      and organization_members.role = 'admin'
    )
  );

-- RLS Policies for teams
create policy "Users can view teams in their organizations"
  on public.teams for select
  using (
    exists (
      select 1 from public.organization_members
      where organization_members.organization_id = teams.organization_id
      and organization_members.user_id = auth.uid()
    )
  );

create policy "Admins can create teams in their organizations"
  on public.teams for insert
  with check (
    exists (
      select 1 from public.organization_members
      where organization_members.organization_id = teams.organization_id
      and organization_members.user_id = auth.uid()
      and organization_members.role = 'admin'
    )
  );

create policy "Admins can update teams in their organizations"
  on public.teams for update
  using (
    exists (
      select 1 from public.organization_members
      where organization_members.organization_id = teams.organization_id
      and organization_members.user_id = auth.uid()
      and organization_members.role = 'admin'
    )
  );

create policy "Admins can delete teams in their organizations"
  on public.teams for delete
  using (
    exists (
      select 1 from public.organization_members
      where organization_members.organization_id = teams.organization_id
      and organization_members.user_id = auth.uid()
      and organization_members.role = 'admin'
    )
  );

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

create policy "Users can join organizations (handled by function)"
  on public.organization_members for insert
  with check (auth.uid() is not null);

create policy "Admins can update member roles"
  on public.organization_members for update
  using (
    exists (
      select 1 from public.organization_members om
      where om.organization_id = organization_members.organization_id
      and om.user_id = auth.uid()
      and om.role = 'admin'
    )
  );

create policy "Users can leave organizations"
  on public.organization_members for delete
  using (
    organization_members.user_id = auth.uid()
    or exists (
      select 1 from public.organization_members om
      where om.organization_id = organization_members.organization_id
      and om.user_id = auth.uid()
      and om.role = 'admin'
    )
  );

-- RLS Policies for team_members
create policy "Users can view team members in their organizations"
  on public.team_members for select
  using (
    exists (
      select 1 from public.teams t
      join public.organization_members om on om.organization_id = t.organization_id
      where t.id = team_members.team_id
      and om.user_id = auth.uid()
    )
  );

create policy "Admins can add team members"
  on public.team_members for insert
  with check (
    exists (
      select 1 from public.teams t
      join public.organization_members om on om.organization_id = t.organization_id
      where t.id = team_members.team_id
      and om.user_id = auth.uid()
      and om.role = 'admin'
    )
  );

create policy "Admins can remove team members"
  on public.team_members for delete
  using (
    exists (
      select 1 from public.teams t
      join public.organization_members om on om.organization_id = t.organization_id
      where t.id = team_members.team_id
      and om.user_id = auth.uid()
      and om.role = 'admin'
    )
    or team_members.user_id = auth.uid()
  );

-- Function to generate unique invite code
create or replace function generate_invite_code()
returns text as $$
declare
  chars text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result text := '';
  i integer;
begin
  for i in 1..8 loop
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  end loop;
  return result;
end;
$$ language plpgsql;

-- Function to automatically add creator as admin when creating organization
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

-- Function to join organization by invite code
create or replace function join_organization(invite_code text)
returns uuid as $$
declare
  org_id uuid;
begin
  -- Find organization by invite code
  select id into org_id
  from public.organizations
  where organizations.invite_code = join_organization.invite_code;

  if org_id is null then
    raise exception 'Invalid invite code';
  end if;

  -- Check if user is already a member
  if exists (
    select 1 from public.organization_members
    where organization_members.organization_id = org_id
    and organization_members.user_id = auth.uid()
  ) then
    raise exception 'You are already a member of this organization';
  end if;

  -- Add user as member
  insert into public.organization_members (organization_id, user_id, role)
  values (org_id, auth.uid(), 'member');

  return org_id;
end;
$$ language plpgsql security definer;

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger update_organizations_updated_at
  before update on public.organizations
  for each row
  execute function update_updated_at_column();

create trigger update_teams_updated_at
  before update on public.teams
  for each row
  execute function update_updated_at_column();
