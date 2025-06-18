/*
  # Fix handle_new_user trigger function

  1. Updates
    - Fix the `handle_new_user` trigger function to properly handle user metadata
    - Ensure all required fields are populated correctly
    - Handle the user_role enum properly
    - Create associated records for user_preferences, eco_stats, and mood_profiles

  2. Security
    - Maintains existing RLS policies
    - Ensures proper data initialization for new users
*/

-- Drop and recreate the handle_new_user function
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role_val user_role;
  user_name_val text;
BEGIN
  -- Extract role from raw_user_meta_data, default to 'customer'
  user_role_val := COALESCE(
    (NEW.raw_user_meta_data->>'role')::user_role,
    'customer'::user_role
  );
  
  -- Extract name from raw_user_meta_data, default to email prefix
  user_name_val := COALESCE(
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1)
  );

  -- Insert into profiles table
  INSERT INTO profiles (id, email, name, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    user_name_val,
    user_role_val,
    NOW(),
    NOW()
  );

  -- Create user preferences record
  INSERT INTO user_preferences (user_id, dark_mode, notifications, share_eco_impact, created_at, updated_at)
  VALUES (
    NEW.id,
    false,
    true,
    true,
    NOW(),
    NOW()
  );

  -- Create eco stats record (only for customers)
  IF user_role_val = 'customer' THEN
    INSERT INTO eco_stats (user_id, trees_planted, carbon_reduced, water_saved, total_eco_credits, created_at, updated_at)
    VALUES (
      NEW.id,
      0,
      0,
      0,
      0,
      NOW(),
      NOW()
    );

    -- Create mood profile record (only for customers)
    INSERT INTO mood_profiles (
      user_id, 
      dominant_mood, 
      mood_distribution, 
      personality, 
      preferences, 
      spending_by_mood, 
      created_at, 
      updated_at
    )
    VALUES (
      NEW.id,
      'casual',
      '{"casual": 100}'::jsonb,
      '[]'::jsonb,
      '[]'::jsonb,
      '{}'::jsonb,
      NOW(),
      NOW()
    );
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error and re-raise it
    RAISE LOG 'Error in handle_new_user trigger: %', SQLERRM;
    RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();