import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SubmitReportModal } from "./submit-report-modal";

interface SubmitReportButtonProps {
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
  className?: string;
  companyName?: string;
}

export function SubmitReportButton({
  variant = "default",
  size = "default",
  className = "",
  companyName,
}: SubmitReportButtonProps) {
  return (
    <SubmitReportModal
      trigger={
        <Button
          variant={variant}
          size={size}
          className={`bg-blue-600 hover:bg-blue-700 text-white rounded-lg ${className}`}
        >
          <Plus className="w-4 h-4 mr-2" />
          Submit Report
        </Button>
      }
      initialCompanyName={companyName}
    />
  );
}
