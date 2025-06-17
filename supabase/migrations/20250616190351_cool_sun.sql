/*
  # Sample Data Migration

  1. Sample Products
    - Create sample products without requiring specific vendor IDs
    - Add ESG metadata and transparency index data
    - Use placeholder vendor_id that will be updated when real vendors sign up

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
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440001',
  NULL,
  'Ethereal Silk Dress',
  'Sustainable silk dress crafted from regenerative silkworms',
  189.00,
  'https://images.pexels.com/photos/1020370/pexels-photo-1020370.jpeg?auto=compress&cs=tinysrgb&w=800',
  'dresses',
  '["elegant", "romantic", "confident"]',
  '["Pair with delicate jewelry", "Add a light cardigan for versatility"]',
  '["silk-scarf", "vintage-heels", "minimalist-jewelry"]',
  true
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  NULL,
  'Ocean Breeze Linen Shirt',
  'Breathable linen made from recycled ocean plastic',
  98.00,
  'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800',
  'tops',
  '["casual", "calm", "adventurous"]',
  '["Roll up sleeves for casual look", "Tuck into high-waisted pants"]',
  '["denim-jeans", "canvas-sneakers", "crossbody-bag"]',
  true
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  NULL,
  'Bold Statement Jacket',
  'Upcycled denim jacket with artistic embroidery',
  245.00,
  'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=800',
  'jackets',
  '["bold", "confident", "adventurous"]',
  '["Layer over simple pieces", "Perfect for music festivals"]',
  '["white-tee", "black-jeans", "ankle-boots"]',
  true
),
(
  '550e8400-e29b-41d4-a716-446655440004',
  NULL,
  'Zen Garden Meditation Pants',
  'Organic hemp pants for mindful movement',
  67.00,
  'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800',
  'bottoms',
  '["calm", "casual", "zen"]',
  '["Great for yoga and lounging", "Pair with fitted top"]',
  '["crop-top", "sneakers", "yoga-mat"]',
  true
),
(
  '550e8400-e29b-41d4-a716-446655440005',
  NULL,
  'Professional Power Blazer',
  'Tailored blazer from recycled wool fibers',
  178.00,
  'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800',
  'jackets',
  '["professional", "confident", "elegant"]',
  '["Perfect for boardroom meetings", "Dress down with jeans"]',
  '["silk-blouse", "dress-pants", "leather-heels"]',
  true
),
(
  '550e8400-e29b-41d4-a716-446655440006',
  NULL,
  'Romantic Moonlight Skirt',
  'Flowing skirt made from peace silk',
  134.00,
  'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=800',
  'skirts',
  '["romantic", "elegant", "dreamy"]',
  '["Perfect for date nights", "Add a denim jacket for contrast"]',
  '["camisole", "strappy-sandals", "delicate-necklace"]',
  true
)
ON CONFLICT (id) DO NOTHING;

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
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440001',
  2.3,
  45,
  'Karnataka, India',
  9.2,
  '["Peace Silk", "Organic Cotton"]',
  '["GOTS", "Fair Trade", "Cradle to Cradle"]',
  9.5,
  true,
  true,
  'high',
  '2024-01-15'
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  1.8,
  32,
  'California, USA',
  8.7,
  '["Recycled Ocean Plastic", "Organic Linen"]',
  '["Ocean Positive", "OEKO-TEX"]',
  8.2,
  false,
  false,
  'medium',
  '2023-11-20'
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  3.1,
  78,
  'Mexico City, Mexico',
  8.9,
  '["Upcycled Denim", "Organic Cotton Thread"]',
  '["Upcycled Certified", "B-Corp"]',
  9.0,
  true,
  true,
  'high',
  '2024-02-01'
),
(
  '550e8400-e29b-41d4-a716-446655440004',
  1.2,
  28,
  'Oregon, USA',
  9.5,
  '["Organic Hemp", "Natural Dyes"]',
  '["USDA Organic", "Carbon Neutral"]',
  8.8,
  false,
  true,
  'high',
  '2024-01-05'
),
(
  '550e8400-e29b-41d4-a716-446655440005',
  2.7,
  52,
  'Scotland, UK',
  8.4,
  '["Recycled Wool", "Recycled Polyester Lining"]',
  '["RWS", "Recycled Claim Standard"]',
  7.5,
  false,
  false,
  'medium',
  '2023-10-15'
),
(
  '550e8400-e29b-41d4-a716-446655440006',
  1.9,
  41,
  'Tamil Nadu, India',
  9.1,
  '["Peace Silk", "Natural Dyes"]',
  '["GOTS", "Ahimsa Silk"]',
  9.2,
  true,
  true,
  'high',
  '2024-01-20'
)
ON CONFLICT (product_id) DO NOTHING;

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
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440001',
  92,
  95,
  true,
  'LCA ISO 14040/14044',
  88,
  true,
  'Water Footprint Network',
  96,
  true,
  '2024-01-15',
  90,
  true,
  'Farm to garment tracking'
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  78,
  82,
  true,
  'GHG Protocol',
  85,
  true,
  'Water Footprint Assessment',
  75,
  true,
  '2023-11-20',
  70,
  false,
  'Partial supply chain visibility'
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  85,
  80,
  false,
  'Estimated based on upcycling process',
  88,
  true,
  'Direct measurement',
  92,
  true,
  '2024-02-01',
  85,
  true,
  'Direct partnership with artisans'
),
(
  '550e8400-e29b-41d4-a716-446655440004',
  94,
  98,
  true,
  'Carbon Trust Standard',
  95,
  true,
  'Direct farm measurement',
  90,
  true,
  '2024-01-05',
  95,
  true,
  'Seed to garment tracking'
),
(
  '550e8400-e29b-41d4-a716-446655440005',
  72,
  75,
  true,
  'Higg MSI',
  78,
  true,
  'Higg FEM',
  68,
  true,
  '2023-10-15',
  65,
  false,
  'Limited supply chain visibility'
),
(
  '550e8400-e29b-41d4-a716-446655440006',
  89,
  85,
  true,
  'GOTS LCA',
  90,
  true,
  'GOTS Water Assessment',
  94,
  true,
  '2024-01-20',
  88,
  true,
  'Cocoon to garment tracking'
)
ON CONFLICT (product_id) DO NOTHING;