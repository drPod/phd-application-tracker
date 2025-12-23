import { AppShell } from "@/components/shell/AppShell";

// Force dynamic rendering for all app routes (they require authentication)
export const dynamic = 'force-dynamic';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}

