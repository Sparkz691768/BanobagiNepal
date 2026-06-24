alter table public.categories
  add column if not exists parent_id uuid references public.categories(id) on delete restrict;

alter table public.products
  add column if not exists category_ids uuid[] default '{}';

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'products'
      and column_name = 'category_id'
  ) then
    execute $sql$
      update public.products
      set category_ids = array[category_id]
      where category_id is not null
        and (category_ids is null or cardinality(category_ids) = 0)
    $sql$;
  end if;
end $$;

update public.products
set category_ids = '{}'
where category_ids is null;

alter table public.products
  alter column category_ids set default '{}';
