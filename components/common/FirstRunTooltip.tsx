"use client";

import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FirstRunTooltipProps {
  id: string;
  children: React.ReactNode;
  content: string;
  side?: "top" | "bottom" | "left" | "right";
}

export function FirstRunTooltip({
  id,
  children,
  content,
  side = "top",
}: FirstRunTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem(`tooltip-${id}-seen`);
    if (!hasSeen) {
      setIsOpen(true);
    }
  }, [id]);

  const handleDismiss = () => {
    setIsOpen(false);
    localStorage.setItem(`tooltip-${id}-seen`, "true");
  };

  if (!isOpen) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} className="max-w-xs">
          <div className="space-y-2">
            <p className="text-sm">{content}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0 absolute top-1 right-1"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

