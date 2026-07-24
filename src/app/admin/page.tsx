import { createClient } from "@/utils/supabase/server";
import { format } from "date-fns";
import { 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  Users, 
  ArrowUpRight,
  Clock
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch summary stats
  const { count: orderCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  const { data: revenueData } = await supabase
    .from('orders')
    .select('total')
    .neq('status', 'cancelled');
    
  const totalRevenue = revenueData?.reduce((sum, order) => sum + order.total, 0) || 0;

  const { count: productCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  const { count: customerCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .neq('role', 'admin');

  // Fetch recent orders
  const { data: recentOrders } = await supabase
    .from('orders')
    .select(`
      id,
      total,
      status,
      created_at,
      user_id
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  const stats = [
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      icon: TrendingUp,
      trend: "+12.5%",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Total Orders",
      value: orderCount?.toString() || "0",
      icon: ShoppingBag,
      trend: "+5.2%",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Total Products",
      value: productCount?.toString() || "0",
      icon: Package,
      trend: "+2",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Total Customers",
      value: customerCount?.toString() || "0",
      icon: Users,
      trend: "+18%",
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ];

  return (
    <div className="space-y-8 mt-12 md:mt-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-primary">Dashboard</h1>
          <p className="text-sm text-foreground/70">Welcome back. Here's what's happening with your store today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/products/new">
            <Button>Add Product</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/60">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-success font-medium flex items-center">
                <ArrowUpRight size={16} className="mr-1" />
                {stat.trend}
              </span>
              <span className="text-foreground/50 ml-2">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h2 className="text-lg font-bold font-heading">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {!recentOrders || recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                      No recent orders.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => {
                    const userObj: any = Array.isArray(order.user) ? order.user[0] : order.user;
                    const userData = userObj?.raw_user_meta_data;
                    const customerName = userData?.first_name 
                      ? `${userData.first_name} ${userData.last_name || ''}`
                      : userObj?.email || 'Guest';

                    return (
                      <tr key={order.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-primary">
                          {order.id.split('-')[0]}...
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium">{customerName}</div>
                          <div className="text-xs text-muted-foreground">{userObj?.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            order.status === 'delivered' ? 'bg-success/10 text-success' :
                            order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-600' :
                            order.status === 'cancelled' ? 'bg-destructive/10 text-destructive' :
                            'bg-blue-500/10 text-blue-600'
                          }`}>
                            <span className="capitalize">{order.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-medium">
                          ₹{order.total.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Activity */}
        <div className="bg-card border border-border rounded-xl shadow-sm">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-bold font-heading">Recent Activity</h2>
          </div>
          <div className="p-6 space-y-6">
            {!recentOrders || recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent activity.</p>
            ) : (
              recentOrders.slice(0, 4).map((order) => (
                <div key={order.id} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ShoppingBag size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      New order <span className="font-mono text-primary">{order.id.split('-')[0]}</span> placed
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock size={12} /> {format(new Date(order.created_at), 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
