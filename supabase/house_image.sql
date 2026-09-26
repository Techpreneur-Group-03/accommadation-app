-- Populate public.houses.house_image with a house photo per listing.
-- Run once in the Supabase SQL Editor. Safe to run more than once.
--
-- The photo ids below were each verified to return HTTP 200. The order mirrors
-- src/lib/house-images.ts, and the index is derived from house_id, so a given
-- house always keeps the same photo and the two files stay in sync.
alter table public.houses
  add column if not exists house_image text;

update public.houses
set house_image = 'https://images.unsplash.com/photo-' || photos.photo_id || '?auto=format&fit=crop&w=900&q=80'
from (
  values
    (1, '1512917774080-9991f1c4c750'),
    (2, '1560448204-e02f11c3d0e2'),
    (3, '1568605114967-8130f3a36994'),
    (4, '1570129477492-45c003edd2be'),
    (5, '1580587771525-78b9dba3b914'),
    (6, '1600585154340-be6161a56a0c'),
    (7, '1600596542815-ffad4c1539a9'),
    (8, '1600607687939-ce8a6c25118c'),
    (9, '1493809842364-78817add7ffb'),
    (10, '1522708323590-d24dbb6b0267'),
    (11, '1449844908441-8829872d2607'),
    (12, '1583608205776-bfd35f0d9f83'),
    (13, '1512915922686-57c11dde9b6b'),
    (14, '1554995207-c18c203602cb'),
    (15, '1484154218962-a197022b5858'),
    (16, '1605276374104-dee2a0ed3cd6'),
    (17, '1586023492125-27b2c045efd7'),
    (18, '1502005229762-cf1b2da7c5d6')
) as photos(idx, photo_id)
where houses.house_image is distinct from
  'https://images.unsplash.com/photo-' || photos.photo_id || '?auto=format&fit=crop&w=900&q=80'
  and ((houses.house_id - 1) % 18) = photos.idx - 1;
