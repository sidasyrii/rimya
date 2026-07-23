import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  // Check role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-destructive mb-4">Access Denied</h1>
        <p className="text-foreground/70 mb-8">You do not have permission to view the admin portal.</p>
        <a href="/" className="px-6 py-2 bg-primary text-primary-foreground rounded-md">Return Home</a>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <AdminSidebar />
      <div className="md:pl-64 transition-all duration-300">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
