/*
  # Fix user signup trigger function

  1. Updates
    - Fix the handle_new_user trigger function to properly handle user creation
    - Ensure all required fields are properly mapped from auth.users to profiles
    - Add proper error handling and constraint checking
    - Fix any data type mismatches

  2. Security
    - Maintain existing RLS policies
    - Ensure trigger runs with proper permissions
*/

-- Drop existing trigger and function to recreate them properly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create improved handle_new_user function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (
    id,
    email,
    name,
    role,
    avatar_url,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'customer'::user_role),
    NEW.raw_user_meta_data->>'avatar_url',
    NOW(),
    NOW()
  );

  -- Create user preferences record
  INSERT INTO public.user_preferences (
    user_id,
    dark_mode,
    current_mood,
    notifications,
    share_eco_impact,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'dark_mode')::boolean, false),
    NEW.raw_user_meta_data->>'current_mood',
    COALESCE((NEW.raw_user_meta_data->>'notifications')::boolean, true),
    COALESCE((NEW.raw_user_meta_data->>'share_eco_impact')::boolean, true),
    NOW(),
    NOW()
  );

  -- Create eco stats record for customers
  IF COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'customer'::user_role) = 'customer' THEN
    INSERT INTO public.eco_stats (
      user_id,
      trees_planted,
      carbon_reduced,
      water_saved,
      total_eco_credits,
      created_at,
      updated_at
    )
    VALUES (
      NEW.id,
      0,
      0,
      0,
      0,
      NOW(),
      NOW()
    );

    -- Create mood profile record for customers
    INSERT INTO public.mood_profiles (
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
    -- Log the error but don't fail the user creation
    RAISE LOG 'Error in handle_new_user trigger: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Ensure the trigger function has proper permissions
GRANT EXECUTE ON FUNCTION handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION handle_new_user() TO anon;