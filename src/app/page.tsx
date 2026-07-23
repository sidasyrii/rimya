import { createClient } from "@/utils/supabase/server";
import HomeClient from "./HomeClient";

export default async function HomePage() {
  // We can fetch data here if needed in the future
  return <HomeClient />;
}
