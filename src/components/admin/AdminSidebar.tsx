"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Ticket,
  Settings,
  ChevronLeft,
  ChevronRight,
  Store,
  Menu,
  X,
  LogOut,
  BarChart3,
  Layers,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: Layers },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Coupons", href: "/admin/coupons", icon: Ticket },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <>
      {/* Logo Area */}
      <div className={cn(
        "flex items-center gap-3 px-4 py-5 border-b border-white/10",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed && (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
              <Store size={18} className="text-secondary" />
            </div>
            <div className="min-w-0">
              <h2 className="font-heading font-bold text-sm text-white truncate">Anubandha</h2>
              <p className="text-[10px] text-white/50 uppercase tracking-widest">Admin Panel</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex items-center justify-center w-7 h-7 rounded-md hover:bg-white/10 text-white/60 hover:text-white transition-colors flex-shrink-0"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                active
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-white/60 hover:text-white hover:bg-white/8",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon size={20} className={cn(
                "flex-shrink-0 transition-colors",
                active ? "text-secondary" : "text-white/50 group-hover:text-white/80"
              )} />
              {!collapsed && <span>{item.name}</span>}
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-secondary rounded-r-full" />
              )}
              {/* Tooltip for collapsed state */}
              {collapsed && (
                <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-lg pointer-events-none">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className={cn(
        "px-3 py-4 border-t border-white/10 space-y-2",
        collapsed && "px-2"
      )}>
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/8 transition-all",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>Back to Store</span>}
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-lg shadow-lg"
        aria-label="Open admin menu"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={cn(
        "md:hidden fixed top-0 left-0 bottom-0 w-64 bg-primary z-50 flex flex-col transition-transform duration-300",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-white/10 text-white/60 hover:text-white"
        >
          <X size={18} />
        </button>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex flex-col fixed top-0 left-0 bottom-0 bg-primary z-30 transition-all duration-300 border-r border-white/5",
        collapsed ? "w-[68px]" : "w-64"
      )}>
        <SidebarContent />
      </aside>
    </>
  );
}
