-- Per-location image galleries: let a photo_placement target an area/location page
-- (location_slug), alongside the existing service_slug and global (both null) targets.
alter table photo_placements add column if not exists location_slug text;
create index if not exists photo_placements_location_idx on photo_placements(location_slug);
