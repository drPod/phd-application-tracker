"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const fieldsOfStudy = [
  "Computer Science",
  "Biology",
  "Chemistry",
  "Physics",
  "Mathematics",
  "Engineering",
  "Psychology",
  "Economics",
  "Other",
];

interface OnboardingStepperProps {
  onComplete: (data: {
    fieldOfStudy: string;
    program: {
      university: string;
      department: string;
      deadline: Date;
    };
  }) => void;
}

export function OnboardingStepper({ onComplete }: OnboardingStepperProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [customField, setCustomField] = useState("");
  const [university, setUniversity] = useState("");
  const [department, setDepartment] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleFieldSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fieldOfStudy) {
      setStep(2);
    }
  };

  const handleProgramSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (university && department && deadline) {
      const finalField = fieldOfStudy === "Other" ? customField : fieldOfStudy;
      onComplete({
        fieldOfStudy: finalField,
        program: {
          university,
          department,
          deadline: new Date(deadline),
        },
      });
      router.push("/app/programs");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                    step >= s
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted text-muted-foreground"
                  )}
                >
                  {step > s ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-medium">{s}</span>
                  )}
                </div>
                {s < 2 && (
                  <div
                    className={cn(
                      "h-0.5 w-16 transition-colors",
                      step > s ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>
                  {step === 1 ? "Welcome! Let's get started" : "Add your first program"}
                </CardTitle>
                <CardDescription className="mt-1">
                  {step === 1
                    ? "Tell us about your field of study"
                    : "Add your first PhD program application"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <form onSubmit={handleFieldSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="field">Field of Study</Label>
                  <Select
                    value={fieldOfStudy}
                    onValueChange={setFieldOfStudy}
                    required
                  >
                    <SelectTrigger id="field">
                      <SelectValue placeholder="Select your field" />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldsOfStudy.map((field) => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {fieldOfStudy === "Other" && (
                  <div className="space-y-2">
                    <Label htmlFor="customField">Specify your field</Label>
                    <Input
                      id="customField"
                      value={customField}
                      onChange={(e) => setCustomField(e.target.value)}
                      placeholder="Enter your field of study"
                      required={fieldOfStudy === "Other"}
                    />
                  </div>
                )}

                <div className="flex justify-end">
                  <Button type="submit" disabled={!fieldOfStudy || (fieldOfStudy === "Other" && !customField)}>
                    Continue
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleProgramSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="university">University</Label>
                  <Input
                    id="university"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    placeholder="e.g., MIT"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g., Computer Science"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Application Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                  />
                </div>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={!university || !department || !deadline}
                  >
                    Complete Setup
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

