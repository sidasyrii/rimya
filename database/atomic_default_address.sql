CREATE OR REPLACE FUNCTION public.set_default_address(p_user_id UUID, p_address_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE user_addresses SET is_default = false WHERE user_id = p_user_id AND is_default = true;
  UPDATE user_addresses SET is_default = true WHERE id = p_address_id AND user_id = p_user_id;
END;
$$;
