"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  GraduationCap,
  Users,
  Calendar,
  Mail,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Programs", href: "/app/programs", icon: GraduationCap },
  { name: "Documents", href: "/app/documents", icon: FileText },
  { name: "Timeline", href: "/app/timeline", icon: Calendar, comingSoon: true },
  { name: "Letters", href: "/app/letters", icon: Mail, comingSoon: true },
  { name: "Faculty", href: "/app/faculty", icon: Users, comingSoon: true },
  { name: "Settings", href: "/app/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center border-b border-border px-6">
        <h1 className="text-lg font-semibold">PhD Tracker</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.comingSoon) {
            return (
              <div
                key={item.name}
                className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground opacity-50 cursor-not-allowed"
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  Soon
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

