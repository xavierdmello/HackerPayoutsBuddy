"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useChainId, useWriteContract } from "wagmi";
import { abi } from "../app/abi";
import config from "../app/config";
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
  const { writeContract } = useWriteContract();
  const [open, setOpen] = useState(false);
  const [aiAgentOpen, setAiAgentOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [organization, setOrganization] = useState(initialCompanyName || "");
  const [hackathon, setHackathon] = useState("");
  const [title, setTitle] = useState("");
  const [orgSuggestions, setOrgSuggestions] = useState<string[]>([]);
  const [hackathonSuggestions, setHackathonSuggestions] = useState<string[]>(
    []
  );
  const chainid = useChainId();
  const [showOrgSuggestions, setShowOrgSuggestions] = useState(false);
  const [showHackathonSuggestions, setShowHackathonSuggestions] =
    useState(false);
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [prizePaidOut, setPrizePaidOut] = useState(false);
  const [description, setDescription] = useState("");
  const [prizeAmount, setPrizeAmount] = useState("");
  const [endDate, setEndDate] = useState("");
  const [payoutDate, setPayoutDate] = useState("");
  const [errors, setErrors] = useState<{
    endDate?: string;
    payoutDate?: string;
    screenshots?: string;
  }>({});

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

  const validateDates = () => {
    const newErrors: typeof errors = {};
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today

    // Validate end date
    if (endDate) {
      const endDateObj = new Date(endDate);
      if (endDateObj > today) {
        newErrors.endDate = "Hackathon end date cannot be in the future";
      }
    }

    // Validate payout date if prize is paid out
    if (prizePaidOut && payoutDate) {
      const payoutDateObj = new Date(payoutDate);
      const endDateObj = new Date(endDate);

      if (payoutDateObj > today) {
        newErrors.payoutDate = "Payout date cannot be in the future";
      }
      if (endDate && payoutDateObj < endDateObj) {
        newErrors.payoutDate =
          "Payout date cannot be before the hackathon ended";
      }
    }

    // Validate screenshots
    if (screenshots.length === 0) {
      newErrors.screenshots = "Please upload at least one screenshot";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateDates()) {
      return;
    }

    // Close the form modal
    setOpen(false);

    // Open the AI agent modal
    setAiAgentOpen(true);
  };

  const handleAiAgentClose = () => {
    setAiAgentOpen(false);

    // Submit the transaction when AI verification is complete
    writeContract({
      abi,
      address: config[chainid].address as `0x${string}`,
      functionName: "submitReview",
      args: [
        organization,
        hackathon,
        title,
        description,
        rating,
        [], // evidenceHashes - empty array for now
        BigInt(prizeAmount || "0"),
        endDate ? BigInt(new Date(endDate).getTime() / 1000) : BigInt(0),
        prizePaidOut,
        prizePaidOut ? BigInt(new Date().getTime() / 1000) : BigInt(0),
      ],
    });

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

            {/* Review Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Review Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Great experience with ETHGlobal NYC 2024"
                required
              />
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
                    className="p-1 group"
                    onMouseEnter={() => {
                      const stars = document.querySelectorAll(".star-rating");
                      stars.forEach((s, i) => {
                        if (i < star) {
                          s.classList.add("fill-yellow-400", "text-yellow-400");
                        } else {
                          s.classList.remove(
                            "fill-yellow-400",
                            "text-yellow-400"
                          );
                        }
                      });
                    }}
                    onMouseLeave={() => {
                      const stars = document.querySelectorAll(".star-rating");
                      stars.forEach((s, i) => {
                        if (i < rating) {
                          s.classList.add("fill-yellow-400", "text-yellow-400");
                        } else {
                          s.classList.remove(
                            "fill-yellow-400",
                            "text-yellow-400"
                          );
                        }
                      });
                    }}
                  >
                    <Star
                      className={`w-6 h-6 star-rating ${
                        star <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      } transition-colors`}
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
                value={prizeAmount}
                onChange={(e) => setPrizeAmount(e.target.value)}
              />
            </div>

            {/* Hackathon End Date */}
            <div className="space-y-2">
              <Label htmlFor="endDate">Hackathon End Date *</Label>
              <Input
                id="endDate"
                type="date"
                required
                max={new Date().toISOString().split("T")[0]}
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  validateDates();
                }}
              />
              {errors.endDate && (
                <p className="text-sm text-red-600">{errors.endDate}</p>
              )}
            </div>

            {/* Prize Paid Out */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="prizePaidOut"
                  checked={prizePaidOut}
                  onCheckedChange={(checked) => {
                    setPrizePaidOut(checked as boolean);
                    if (!checked) {
                      setPayoutDate("");
                    }
                  }}
                />
                <Label htmlFor="prizePaidOut">Prize has been paid out</Label>
              </div>

              {/* Payout Date (if paid) */}
              {prizePaidOut && (
                <div className="space-y-2">
                  <Label htmlFor="payoutDate">Date Prize Was Received *</Label>
                  <Input
                    id="payoutDate"
                    type="date"
                    required
                    min={endDate}
                    max={new Date().toISOString().split("T")[0]}
                    value={payoutDate}
                    onChange={(e) => {
                      setPayoutDate(e.target.value);
                      validateDates();
                    }}
                  />
                  {errors.payoutDate && (
                    <p className="text-sm text-red-600">{errors.payoutDate}</p>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your experience with the payout process, communication, any issues encountered, etc."
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Screenshot Upload */}
            <div className="space-y-2">
              <Label>Evidence Screenshots *</Label>
              <div
                className={`border-2 border-dashed ${
                  errors.screenshots ? "border-red-300" : "border-gray-300"
                } rounded-lg p-4 ${
                  screenshots.length > 0 ? "border-opacity-50" : ""
                }`}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="screenshot-upload"
                  required={screenshots.length === 0}
                />
                <label
                  htmlFor="screenshot-upload"
                  className={`flex flex-col items-center justify-center cursor-pointer ${
                    screenshots.length > 0 ? "py-2" : "py-6"
                  }`}
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Click to upload screenshots
                  </span>
                  <span className="text-xs text-gray-400">
                    PNG, JPG up to 10MB each
                  </span>
                </label>

                {screenshots.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {screenshots.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Screenshot ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeScreenshot(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 px-2 truncate">
                          {file.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.screenshots && (
                <p className="text-sm text-red-600">{errors.screenshots}</p>
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
      <AiAgentModal
        open={aiAgentOpen}
        onClose={handleAiAgentClose}
        screenshots={screenshots}
        organization={organization}
        hackathon={hackathon}
        title={title}
        description={description}
        rating={rating}
        prizeAmount={prizeAmount}
        endDate={endDate}
        prizePaidOut={prizePaidOut}
        payoutDate={payoutDate}
      />
    </>
  );
}
