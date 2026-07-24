import { createClient } from "@/utils/supabase/server";

export default async function AdminDebugPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  const { data: session } = await supabase.auth.getSession();

  let profile = null;
  let profileError = null;
  if (user) {
    const { data: p, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    profile = p;
    profileError = error;
  }

  const isAdminEmail = user?.email === 'theanubandha@gmaail.com' || user?.email === 'theanubandha@gmail.com';

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-red-500">Admin Debug Diagnostics</h1>
      
      <div className="bg-muted p-4 rounded-lg overflow-auto">
        <h2 className="font-bold mb-2">Auth User Object</h2>
        <pre className="text-xs">{JSON.stringify(user, null, 2)}</pre>
      </div>

      <div className="bg-muted p-4 rounded-lg overflow-auto">
        <h2 className="font-bold mb-2">Profile Query Result</h2>
        <pre className="text-xs">{JSON.stringify({ profile, error: profileError }, null, 2)}</pre>
      </div>

      <div className="bg-muted p-4 rounded-lg overflow-auto">
        <h2 className="font-bold mb-2">Logic Check</h2>
        <ul className="list-disc pl-5">
          <li><strong>isAdminEmail (layout check):</strong> {isAdminEmail ? 'Yes' : 'No'}</li>
          <li><strong>isDatabaseAdmin (layout check):</strong> {profile?.role === 'admin' ? 'Yes' : 'No'}</li>
        </ul>
      </div>
    </div>
  );
}
