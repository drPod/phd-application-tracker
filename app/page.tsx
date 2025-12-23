import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, Calendar, FileText } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Stop losing track of your PhD applications
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">
            Manage 15 programs, 40 deadlines, and countless emails without the
            spreadsheet hell
          </p>
          <div className="mt-10">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/sign-up">Start organizing free</Link>
            </Button>
          </div>
        </div>

        {/* Hero Visual - Placeholder for dashboard screenshot */}
        <div className="mt-16 mx-auto max-w-5xl">
          <div className="rounded-lg border border-border bg-card p-8 shadow-lg">
            <div className="aspect-video bg-muted rounded flex items-center justify-center">
              <p className="text-muted-foreground">Dashboard Preview</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof - Conditional */}
      <section className="border-t border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Used by applicants to MIT, Stanford, Berkeley...
          </p>
          {/* Testimonial - Conditional */}
          <blockquote className="mt-4 text-lg italic text-foreground">
            &quot;Finally stopped forgetting which professors I&apos;d already
            emailed&quot;
          </blockquote>
          <p className="mt-2 text-sm text-muted-foreground">
            — CS applicant
          </p>
        </div>
      </section>

      {/* Three Feature Showcase */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Track all deadlines in one place</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Never miss an application deadline with color-coded reminders
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Log faculty contacts & responses</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Keep track of every email exchange and meeting
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Version control your SOPs</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage different versions for different programs
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
