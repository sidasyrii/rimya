-- 1. Automatically confirm the email address so they can log in without clicking a verification link
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'theanubandha@gmaail.com';

-- 2. Grant them the 'admin' role in the profiles table
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'theanubandha@gmaail.com');
