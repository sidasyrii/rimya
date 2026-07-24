-- Pro fix: Forcefully ensure the admin profile exists and is linked correctly
DO $$
DECLARE
  v_admin_id UUID;
BEGIN
  -- Get the UUID of the user from auth.users
  SELECT id INTO v_admin_id
  FROM auth.users
  WHERE email IN ('theanubandha@gmail.com', 'theanubandha@gmaail.com')
  LIMIT 1;

  -- If the user exists, forcefully upsert their profile bypassing all RLS
  IF v_admin_id IS NOT NULL THEN
    INSERT INTO public.profiles (id, first_name, last_name, role)
    VALUES (v_admin_id, 'Admin', 'User', 'admin')
    ON CONFLICT (id) DO UPDATE 
    SET role = 'admin';
  END IF;
END $$;
