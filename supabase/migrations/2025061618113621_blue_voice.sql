/*
  # Sample Data Migration

  1. Sample Products
    - Create sample products without requiring specific vendor IDs
    - Add ESG metadata and transparency index data
    - Use NULL vendor_id (properly cast as UUID)

  2. Approach
    - Create products with NULL vendor_id initially
    - Add all ESG metadata
    - Products will be visible but not tied to specific vendors
    - Real vendors can claim/update these products later
*/

-- Insert sample products without vendor association initially
-- These will be visible to all users and can be associated with vendors later
INSERT INTO products (
  id,
  vendor_id,
  name,
  description,
  price,
  image_url,
  category,
  mood_tags,
  styling_tips,
  pairs_with,
  is_active
) 
SELECT 
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  NULL::uuid,
  'Ethereal Silk Dress',
  'Sustainable silk dress crafted from regenerative silkworms',
  189.00,
  'https://images.pexels.com/photos/1020370/pexels-photo-1020370.jpeg?auto=compress&cs=tinysrgb&w=800',
  'dresses',
  '["elegant", "romantic", "confident"]'::jsonb,
  '["Pair with delicate jewelry", "Add a light cardigan for versatility"]'::jsonb,
  '["silk-scarf", "vintage-heels", "minimalist-jewelry"]'::jsonb,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = '550e8400-e29b-41d4-a716-446655440001'::uuid)

UNION ALL

SELECT 
  '550e8400-e29b-41d4-a716-446655440002'::uuid,
  NULL::uuid,
  'Ocean Breeze Linen Shirt',
  'Breathable linen made from recycled ocean plastic',
  98.00,
  'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800',
  'tops',
  '["casual", "calm", "adventurous"]'::jsonb,
  '["Roll up sleeves for casual look", "Tuck into high-waisted pants"]'::jsonb,
  '["denim-jeans", "canvas-sneakers", "crossbody-bag"]'::jsonb,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = '550e8400-e29b-41d4-a716-446655440002'::uuid)

UNION ALL

SELECT 
  '550e8400-e29b-41d4-a716-446655440003'::uuid,
  NULL::uuid,
  'Bold Statement Jacket',
  'Upcycled denim jacket with artistic embroidery',
  245.00,
  'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=800',
  'jackets',
  '["bold", "confident", "adventurous"]'::jsonb,
  '["Layer over simple pieces", "Perfect for music festivals"]'::jsonb,
  '["white-tee", "black-jeans", "ankle-boots"]'::jsonb,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = '550e8400-e29b-41d4-a716-446655440003'::uuid)

UNION ALL

SELECT 
  '550e8400-e29b-41d4-a716-446655440004'::uuid,
  NULL::uuid,
  'Zen Garden Meditation Pants',
  'Organic hemp pants for mindful movement',
  67.00,
  'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800',
  'bottoms',
  '["calm", "casual", "zen"]'::jsonb,
  '["Great for yoga and lounging", "Pair with fitted top"]'::jsonb,
  '["crop-top", "sneakers", "yoga-mat"]'::jsonb,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = '550e8400-e29b-41d4-a716-446655440004'::uuid)

UNION ALL

SELECT 
  '550e8400-e29b-41d4-a716-446655440005'::uuid,
  NULL::uuid,
  'Professional Power Blazer',
  'Tailored blazer from recycled wool fibers',
  178.00,
  'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800',
  'jackets',
  '["professional", "confident", "elegant"]'::jsonb,
  '["Perfect for boardroom meetings", "Dress down with jeans"]'::jsonb,
  '["silk-blouse", "dress-pants", "leather-heels"]'::jsonb,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = '550e8400-e29b-41d4-a716-446655440005'::uuid)

UNION ALL

SELECT 
  '550e8400-e29b-41d4-a716-446655440006'::uuid,
  NULL::uuid,
  'Romantic Moonlight Skirt',
  'Flowing skirt made from peace silk',
  134.00,
  'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=800',
  'skirts',
  '["romantic", "elegant", "dreamy"]'::jsonb,
  '["Perfect for date nights", "Add a denim jacket for contrast"]'::jsonb,
  '["camisole", "strappy-sandals", "delicate-necklace"]'::jsonb,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = '550e8400-e29b-41d4-a716-446655440006'::uuid);

-- Insert ESG metadata for products
INSERT INTO product_esg_metadata (
  product_id,
  carbon_footprint,
  water_usage,
  region,
  sustainability_score,
  materials,
  certifications,
  ethics_rating,
  fair_trade,
  local_sourcing,
  transparency_level,
  audit_date
) 
SELECT 
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  2.3,
  45,
  'Karnataka, India',
  9.2,
  '["Peace Silk", "Organic Cotton"]'::jsonb,
  '["GOTS", "Fair Trade", "Cradle to Cradle"]'::jsonb,
  9.5,
  true,
  true,
  'high',
  '2024-01-15'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM product_esg_metadata WHERE product_id = '550e8400-e29b-41d4-a716-446655440001'::uuid)

UNION ALL

SELECT 
  '550e8400-e29b-41d4-a716-446655440002'::uuid,
  1.8,
  32,
  'California, USA',
  8.7,
  '["Recycled Ocean Plastic", "Organic Linen"]'::jsonb,
  '["Ocean Positive", "OEKO-TEX"]'::jsonb,
  8.2,
  false,
  false,
  'medium',
  '2023-11-20'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM product_esg_metadata WHERE product_id = '550e8400-e29b-41d4-a716-446655440002'::uuid)

UNION ALL

SELECT 
  '550e8400-e29b-41d4-a716-446655440003'::uuid,
  3.1,
  78,
  'Mexico City, Mexico',
  8.9,
  '["Upcycled Denim", "Organic Cotton Thread"]'::jsonb,
  '["Upcycled Certified", "B-Corp"]'::jsonb,
  9.0,
  true,
  true,
  'high',
  '2024-02-01'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM product_esg_metadata WHERE product_id = '550e8400-e29b-41d4-a716-446655440003'::uuid)

UNION ALL

SELECT 
  '550e8400-e29b-41d4-a716-446655440004'::uuid,
  1.2,
  28,
  'Oregon, USA',
  9.5,
  '["Organic Hemp", "Natural Dyes"]'::jsonb,
  '["USDA Organic", "Carbon Neutral"]'::jsonb,
  8.8,
  false,
  true,
  'high',
  '2024-01-05'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM product_esg_metadata WHERE product_id = '550e8400-e29b-41d4-a716-446655440004'::uuid)

UNION ALL

SELECT 
  '550e8400-e29b-41d4-a716-446655440005'::uuid,
  2.7,
  52,
  'Scotland, UK',
  8.4,
  '["Recycled Wool", "Recycled Polyester Lining"]'::jsonb,
  '["RWS", "Recycled Claim Standard"]'::jsonb,
  7.5,
  false,
  false,
  'medium',
  '2023-10-15'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM product_esg_metadata WHERE product_id = '550e8400-e29b-41d4-a716-446655440005'::uuid)

UNION ALL

SELECT 
  '550e8400-e29b-41d4-a716-446655440006'::uuid,
  1.9,
  41,
  'Tamil Nadu, India',
  9.1,
  '["Peace Silk", "Natural Dyes"]'::jsonb,
  '["GOTS", "Ahimsa Silk"]'::jsonb,
  9.2,
  true,
  true,
  'high',
  '2024-01-20'::timestamptz
WHERE NOT EXISTS (SELECT 1 FROM product_esg_metadata WHERE product_id = '550e8400-e29b-41d4-a716-446655440006'::uuid);

-- Insert transparency index data
INSERT INTO product_transparency_index (
  product_id,
  overall_score,
  carbon_score,
  carbon_verified,
  carbon_methodology,
  water_score,
  water_verified,
  water_methodology,
  ethics_score,
  ethics_verified,
  ethics_audit_date,
  region_score,
  region_verified,
  region_traceability
) 
SELECT 
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  92,
  95,
  true,
  'LCA ISO 14040/14044',
  88,
  true,
  'Water Footprint Network',
  96,
  true,
  '2024-01-15'::timestamptz,
  90,
  true,
  'Farm to garment tracking'
WHERE NOT EXISTS (SELECT 1 FROM product_transparency_index WHERE product_id = '550e8400-e29b-41d4-a716-446655440001'::uuid)

UNION ALL

SELECT 
  '550e8400-e29b-41d4-a716-446655440002'::uuid,
  78,
  82,
  true,
  'GHG Protocol',
  85,
  true,
  'Water Footprint Assessment',
  75,
  true,
  '2023-11-20'::timestamptz,
  70,
  false,
  'Partial supply chain visibility'
WHERE NOT EXISTS (SELECT 1 FROM product_transparency_index WHERE product_id = '550e8400-e29b-41d4-a716-446655440002'::uuid)

UNION ALL

SELECT 
  '550e8400-e29b-41d4-a716-446655440003'::uuid,
  85,
  80,
  false,
  'Estimated based on upcycling process',
  88,
  true,
  'Direct measurement',
  92,
  true,
  '2024-02-01'::timestamptz,
  85,
  true,
  'Direct partnership with artisans'
WHERE NOT EXISTS (SELECT 1 FROM product_transparency_index WHERE product_id = '550e8400-e29b-41d4-a716-446655440003'::uuid)

UNION ALL

SELECT 
  '550e8400-e29b-41d4-a716-446655440004'::uuid,
  94,
  98,
  true,
  'Carbon Trust Standard',
  95,
  true,
  'Direct farm measurement',
  90,
  true,
  '2024-01-05'::timestamptz,
  95,
  true,
  'Seed to garment tracking'
WHERE NOT EXISTS (SELECT 1 FROM product_transparency_index WHERE product_id = '550e8400-e29b-41d4-a716-446655440004'::uuid)

UNION ALL

SELECT 
  '550e8400-e29b-41d4-a716-446655440005'::uuid,
  72,
  75,
  true,
  'Higg MSI',
  78,
  true,
  'Higg FEM',
  68,
  true,
  '2023-10-15'::timestamptz,
  65,
  false,
  'Limited supply chain visibility'
WHERE NOT EXISTS (SELECT 1 FROM product_transparency_index WHERE product_id = '550e8400-e29b-41d4-a716-446655440005'::uuid)

UNION ALL

SELECT 
  '550e8400-e29b-41d4-a716-446655440006'::uuid,
  89,
  85,
  true,
  'GOTS LCA',
  90,
  true,
  'GOTS Water Assessment',
  94,
  true,
  '2024-01-20'::timestamptz,
  88,
  true,
  'Cocoon to garment tracking'
WHERE NOT EXISTS (SELECT 1 FROM product_transparency_index WHERE product_id = '550e8400-e29b-41d4-a716-446655440006'::uuid);