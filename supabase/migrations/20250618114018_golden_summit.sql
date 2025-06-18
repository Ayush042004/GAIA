/*
  # Fix handle_new_user trigger function

  1. Updates
    - Fix the handle_new_user trigger function to properly handle user profile creation
    - Ensure all required fields (name, email) are properly extracted and inserted
    - Add proper error handling and fallback values

  2. Security
    - Maintains existing RLS policies
    - No changes to security model
*/

-- Drop and recreate the handle_new_user function with proper error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    name,
    role,
    avatar_url
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'full_name',
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(
      (NEW.raw_user_meta_data->>'role')::user_role,
      'customer'::user_role
    ),
    NEW.raw_user_meta_data->>'avatar_url'
  );

  -- Create default user preferences
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);

  -- Create default eco stats
  INSERT INTO public.eco_stats (user_id)
  VALUES (NEW.id);

  -- Create default mood profile
  INSERT INTO public.mood_profiles (user_id)
  VALUES (NEW.id);

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error and re-raise it
    RAISE LOG 'Error in handle_new_user trigger: %', SQLERRM;
    RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();