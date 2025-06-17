/*
  # Authentication and User Management Schema

  1. New Tables
    - `profiles` - Extended user profiles for customers and vendors
    - `user_preferences` - User settings and preferences
    - `eco_stats` - Environmental impact tracking
    - `mood_profiles` - User mood and personality data
    - `impact_zones` - Environmental impact locations

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure vendor and customer data separation
*/

-- Create enum types
CREATE TYPE user_role AS ENUM ('customer', 'vendor');
CREATE TYPE impact_zone_type AS ENUM ('forest', 'coral', 'mangrove', 'ocean');

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role user_role NOT NULL DEFAULT 'customer',
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  dark_mode boolean DEFAULT false,
  current_mood text,
  notifications boolean DEFAULT true,
  share_eco_impact boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Eco statistics
CREATE TABLE IF NOT EXISTS eco_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  trees_planted integer DEFAULT 0,
  carbon_reduced numeric DEFAULT 0,
  water_saved numeric DEFAULT 0,
  total_eco_credits integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Monthly impact tracking
CREATE TABLE IF NOT EXISTS monthly_impact (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  month text NOT NULL,
  year integer NOT NULL,
  trees integer DEFAULT 0,
  carbon numeric DEFAULT 0,
  water numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, month, year)
);

-- Impact zones
CREATE TABLE IF NOT EXISTS impact_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type impact_zone_type NOT NULL,
  location text NOT NULL,
  coordinates point,
  area numeric,
  date timestamptz DEFAULT now(),
  gifted_by uuid REFERENCES profiles(id),
  message text,
  created_at timestamptz DEFAULT now()
);

-- Mood profiles
CREATE TABLE IF NOT EXISTS mood_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  dominant_mood text,
  mood_distribution jsonb DEFAULT '{}',
  personality jsonb DEFAULT '[]',
  preferences jsonb DEFAULT '[]',
  spending_by_mood jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Mood history
CREATE TABLE IF NOT EXISTS mood_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  mood text NOT NULL,
  confidence numeric NOT NULL,
  context text,
  detected_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  image_url text,
  category text NOT NULL,
  mood_tags jsonb DEFAULT '[]',
  styling_tips jsonb DEFAULT '[]',
  pairs_with jsonb DEFAULT '[]',
  ai_generated_tips jsonb DEFAULT '[]',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ESG metadata for products
CREATE TABLE IF NOT EXISTS product_esg_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  carbon_footprint numeric NOT NULL,
  water_usage numeric NOT NULL,
  region text NOT NULL,
  sustainability_score numeric NOT NULL,
  materials jsonb DEFAULT '[]',
  certifications jsonb DEFAULT '[]',
  ethics_rating numeric DEFAULT 0,
  fair_trade boolean DEFAULT false,
  local_sourcing boolean DEFAULT false,
  transparency_level text DEFAULT 'medium',
  audit_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Transparency index for products
CREATE TABLE IF NOT EXISTS product_transparency_index (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  overall_score integer NOT NULL,
  carbon_score integer NOT NULL,
  carbon_verified boolean DEFAULT false,
  carbon_methodology text,
  water_score integer NOT NULL,
  water_verified boolean DEFAULT false,
  water_methodology text,
  ethics_score integer NOT NULL,
  ethics_verified boolean DEFAULT false,
  ethics_audit_date timestamptz,
  region_score integer NOT NULL,
  region_verified boolean DEFAULT false,
  region_traceability text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Wishlist
CREATE TABLE IF NOT EXISTS wishlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  mood text NOT NULL,
  occasion text,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Wardrobe items
CREATE TABLE IF NOT EXISTS wardrobe_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL,
  color text NOT NULL,
  brand text NOT NULL,
  style text NOT NULL,
  season text NOT NULL,
  image_url text,
  wear_count integer DEFAULT 0,
  last_worn timestamptz,
  tags jsonb DEFAULT '[]',
  mood_tags jsonb DEFAULT '[]',
  price numeric,
  purchase_date timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Cart items (temporary storage)
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  selected_size text,
  selected_color text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  total_amount numeric NOT NULL,
  status text DEFAULT 'pending',
  emotion text,
  occasion text,
  shared_on_social boolean DEFAULT false,
  eco_impact jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL,
  price numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE eco_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_impact ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_esg_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_transparency_index ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wardrobe_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Policies for user_preferences
CREATE POLICY "Users can manage own preferences"
  ON user_preferences
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Policies for eco_stats
CREATE POLICY "Users can read own eco stats"
  ON eco_stats
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own eco stats"
  ON eco_stats
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Policies for monthly_impact
CREATE POLICY "Users can manage own monthly impact"
  ON monthly_impact
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Policies for impact_zones
CREATE POLICY "Users can read own impact zones"
  ON impact_zones
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR gifted_by = auth.uid());

CREATE POLICY "Users can create impact zones"
  ON impact_zones
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policies for mood_profiles
CREATE POLICY "Users can manage own mood profile"
  ON mood_profiles
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Policies for mood_history
CREATE POLICY "Users can manage own mood history"
  ON mood_history
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Policies for products
CREATE POLICY "Anyone can read active products"
  ON products
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Vendors can manage own products"
  ON products
  FOR ALL
  TO authenticated
  USING (vendor_id = auth.uid());

-- Policies for product_esg_metadata
CREATE POLICY "Anyone can read product ESG data"
  ON product_esg_metadata
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Vendors can manage own product ESG data"
  ON product_esg_metadata
  FOR ALL
  TO authenticated
  USING (
    product_id IN (
      SELECT id FROM products WHERE vendor_id = auth.uid()
    )
  );

-- Policies for product_transparency_index
CREATE POLICY "Anyone can read transparency index"
  ON product_transparency_index
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Vendors can manage own transparency index"
  ON product_transparency_index
  FOR ALL
  TO authenticated
  USING (
    product_id IN (
      SELECT id FROM products WHERE vendor_id = auth.uid()
    )
  );

-- Policies for wishlist_items
CREATE POLICY "Users can manage own wishlist"
  ON wishlist_items
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Policies for wardrobe_items
CREATE POLICY "Users can manage own wardrobe"
  ON wardrobe_items
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Policies for cart_items
CREATE POLICY "Users can manage own cart"
  ON cart_items
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Policies for orders
CREATE POLICY "Users can read own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policies for order_items
CREATE POLICY "Users can read own order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    order_id IN (
      SELECT id FROM orders WHERE user_id = auth.uid()
    )
  );

-- Functions and triggers
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'customer')
  );
  
  -- Create default preferences
  INSERT INTO user_preferences (user_id)
  VALUES (NEW.id);
  
  -- Create default eco stats for customers
  IF COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'customer') = 'customer' THEN
    INSERT INTO eco_stats (user_id)
    VALUES (NEW.id);
    
    INSERT INTO mood_profiles (user_id)
    VALUES (NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_eco_stats_updated_at
  BEFORE UPDATE ON eco_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mood_profiles_updated_at
  BEFORE UPDATE ON mood_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_esg_metadata_updated_at
  BEFORE UPDATE ON product_esg_metadata
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wardrobe_items_updated_at
  BEFORE UPDATE ON wardrobe_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();