"use client";

import { useRouter } from "next/navigation";
import { OnboardingStepper } from "@/components/onboarding/OnboardingStepper";
import { useCreateProgram } from "@/lib/hooks/usePrograms";

export default function OnboardingPage() {
  const router = useRouter();
  const createProgram = useCreateProgram();

  const handleComplete = (data: {
    fieldOfStudy: string;
    program: {
      university: string;
      department: string;
      deadline: Date;
    };
  }) => {
    createProgram.mutate(
      {
        university: data.program.university,
        department: data.program.department,
        deadline: data.program.deadline,
        status: "researching",
        requirementsCompleted: 0,
        requirementsTotal: 0,
      },
      {
        onSuccess: () => {
          router.push("/app/programs");
        },
      }
    );
  };

  return <OnboardingStepper onComplete={handleComplete} />;
}
