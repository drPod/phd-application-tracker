// Force dynamic rendering for onboarding (it uses Supabase hooks)
export const dynamic = 'force-dynamic';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

