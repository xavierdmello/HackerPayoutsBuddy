"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Star, Upload, X } from "lucide-react";
import { AiAgentModal } from "./ai-agent-modal";

interface SubmitReportModalProps {
  trigger: React.ReactNode;
  initialCompanyName?: string;
}

const existingOrganizations = [
  "ETHGlobal",
  "TreeHacks",
  "ETHDenver",
  "HackMIT",
  "PennApps",
  "CalHacks",
  "Major League Hacking",
  "Devpost",
  "AngelHack",
  "TechCrunch",
];

const existingHackathons = [
  "ETHGlobal NYC 2024",
  "ETHGlobal London 2024",
  "TreeHacks 2024",
  "ETHDenver 2024",
  "HackMIT 2024",
  "PennApps XXV",
  "CalHacks 11.0",
  "ETHWaterloo 2024",
  "Hack the North 2024",
  "DubHacks 2024",
];

export function SubmitReportModal({
  trigger,
  initialCompanyName,
}: SubmitReportModalProps) {
  const [open, setOpen] = useState(false);
  const [aiAgentOpen, setAiAgentOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [organization, setOrganization] = useState(initialCompanyName || "");
  const [hackathon, setHackathon] = useState("");
  const [orgSuggestions, setOrgSuggestions] = useState<string[]>([]);
  const [hackathonSuggestions, setHackathonSuggestions] = useState<string[]>(
    []
  );
  const [showOrgSuggestions, setShowOrgSuggestions] = useState(false);
  const [showHackathonSuggestions, setShowHackathonSuggestions] =
    useState(false);
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [prizePaidOut, setPrizePaidOut] = useState(false);

  const handleOrgChange = (value: string) => {
    setOrganization(value);
    if (value.length > 0) {
      const filtered = existingOrganizations.filter((org) =>
        org.toLowerCase().includes(value.toLowerCase())
      );
      setOrgSuggestions(filtered);
      setShowOrgSuggestions(true);
    } else {
      setShowOrgSuggestions(false);
    }
  };

  const handleHackathonChange = (value: string) => {
    setHackathon(value);
    if (value.length > 0) {
      const filtered = existingHackathons.filter((hack) =>
        hack.toLowerCase().includes(value.toLowerCase())
      );
      setHackathonSuggestions(filtered);
      setShowHackathonSuggestions(true);
    } else {
      setShowHackathonSuggestions(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setScreenshots([...screenshots, ...newFiles]);
    }
  };

  const removeScreenshot = (index: number) => {
    setScreenshots(screenshots.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Close the form modal
    setOpen(false);

    // Open the AI agent modal
    setAiAgentOpen(true);

    // TODO: Add actual form submission logic here
    console.log("Form submitted");
  };

  const handleAiAgentClose = () => {
    setAiAgentOpen(false);

    // Reset form state
    setRating(0);
    setOrganization("");
    setHackathon("");
    setScreenshots([]);
    setPrizePaidOut(false);
    setShowOrgSuggestions(false);
    setShowHackathonSuggestions(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submit Hackathon Report</DialogTitle>
            <DialogDescription>
              Help improve hackathon transparency by sharing your experience.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Organization */}
            <div className="space-y-2 relative">
              <Label htmlFor="organization">
                Hackathon Organization/Sponsor *
              </Label>
              <Input
                id="organization"
                value={organization}
                onChange={(e) => handleOrgChange(e.target.value)}
                placeholder="e.g., ETHGlobal, TreeHacks, Major League Hacking"
                required
              />
              {showOrgSuggestions && orgSuggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                  {orgSuggestions.map((org, index) => (
                    <button
                      key={index}
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                      onClick={() => {
                        setOrganization(org);
                        setShowOrgSuggestions(false);
                      }}
                    >
                      {org}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Specific Hackathon */}
            <div className="space-y-2 relative">
              <Label htmlFor="hackathon">Specific Hackathon Event *</Label>
              <Input
                id="hackathon"
                value={hackathon}
                onChange={(e) => handleHackathonChange(e.target.value)}
                placeholder="e.g., ETHWaterloo 2025, TreeHacks 2024"
                required
              />
              {showHackathonSuggestions && hackathonSuggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                  {hackathonSuggestions.map((hack, index) => (
                    <button
                      key={index}
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                      onClick={() => {
                        setHackathon(hack);
                        setShowHackathonSuggestions(false);
                      }}
                    >
                      {hack}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <Label>Overall Rating *</Label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      } hover:text-yellow-400 transition-colors`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {rating > 0 && `${rating} star${rating !== 1 ? "s" : ""}`}
                </span>
              </div>
            </div>

            {/* Prize Amount */}
            <div className="space-y-2">
              <Label htmlFor="prizeAmount">Prize Amount (USD)</Label>
              <Input
                id="prizeAmount"
                type="number"
                placeholder="e.g., 5000"
                min="0"
              />
            </div>

            {/* Hackathon End Date */}
            <div className="space-y-2">
              <Label htmlFor="endDate">Hackathon End Date *</Label>
              <Input id="endDate" type="date" required />
            </div>

            {/* Prize Paid Out */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="prizePaidOut"
                checked={prizePaidOut}
                onCheckedChange={(checked) =>
                  setPrizePaidOut(checked as boolean)
                }
              />
              <Label htmlFor="prizePaidOut">Prize has been paid out</Label>
            </div>

            {/* Time to Payout (if paid) */}
            {prizePaidOut && (
              <div className="space-y-2">
                <Label htmlFor="payoutTime">Time taken to receive payout</Label>
                <Input id="payoutTime" placeholder="e.g., 7 days, 3 months" />
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your experience with the payout process, communication, any issues encountered, etc."
                rows={4}
                required
              />
            </div>

            {/* Screenshot Upload */}
            <div className="space-y-2">
              <Label>Evidence Screenshots</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="screenshot-upload"
                />
                <label
                  htmlFor="screenshot-upload"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Click to upload screenshots
                  </span>
                  <span className="text-xs text-gray-400">
                    PNG, JPG up to 10MB each
                  </span>
                </label>
              </div>

              {screenshots.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Screenshots:</Label>
                  {screenshots.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                    >
                      <span className="text-sm text-gray-600">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeScreenshot(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Submit Report
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* AI Agent Modal */}
      <AiAgentModal open={aiAgentOpen} onClose={handleAiAgentClose} />
    </>
  );
}
