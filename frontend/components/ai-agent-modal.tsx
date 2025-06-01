"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, Loader2 } from "lucide-react";
import { useChainId, useWriteContract } from "wagmi";
import { abi } from "@/app/abi";
import config from "../app/config";

interface AiAgentModalProps {
  open: boolean;
  onClose: () => void;
  screenshots: File[];
  organization: string;
  hackathon: string;
  title: string;
  description: string;
  rating: number;
  prizeAmount: string;
  endDate: string;
  prizePaidOut: boolean;
}

const GEMINI_API_KEY = "AIzaSyDNytYifVmjUI52L2iqZS6x0vIDcejNJKs";

const steps = [
  {
    id: 1,
    title: "Anonymously Verifying Win",
    color: "bg-blue-500",
    textColor: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: 2,
    title: "Prizes Verified",
    color: "bg-green-500",
    textColor: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    id: 3,
    title: "Sending Transaction",
    color: "bg-purple-500",
    textColor: "text-purple-600",
    bgColor: "bg-purple-50",
  },
];

interface PrizeCard {
  name: string;
  amount: string;
}

export function AiAgentModal({
  open,
  onClose,
  screenshots,
  organization,
  hackathon,
  title,
  description,
  rating,
  prizeAmount,
  endDate,
  prizePaidOut,
}: AiAgentModalProps) {
  const { writeContract } = useWriteContract();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationFailed, setVerificationFailed] = useState(false);
  const [prizes, setPrizes] = useState<PrizeCard[]>([]);
  const [showMetamask, setShowMetamask] = useState(false);
  const chainId = useChainId();
  useEffect(() => {
    if (!open) {
      // Reset state when modal closes
      setCurrentStep(1);
      setIsLoading(true);
      setVerificationFailed(false);
      setPrizes([]);
      setShowMetamask(false);
      return;
    }

    const verifyWithGemini = async () => {
      try {
        // Convert screenshots to base64
        const imagePromises = screenshots.map(async (file) => {
          return new Promise<{ data: string; mimeType: string }>(
            (resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                if (typeof reader.result === "string") {
                  // Extract base64 data without the prefix
                  const base64Data = reader.result.split(",")[1];
                  resolve({
                    data: base64Data,
                    mimeType: file.type || "image/jpeg",
                  });
                } else {
                  reject(new Error("Failed to convert image to base64"));
                }
              };
              reader.onerror = reject;
              reader.readAsDataURL(file);
            }
          );
        });

        const base64Images = await Promise.all(imagePromises);

        // Prepare the prompt for Gemini
        const prompt = `You are a hackathon prize verification assistant. Please analyze these screenshots and:
        1. Verify if they show hackathon prize wins (look for prize names, amounts, or winning notifications)
        2. Extract the prize names and amounts if found
        3. Return a JSON response in this format:
        {
          "prizesWon": boolean,
          "prizes": [{"name": "string", "amount": "string"}]
        }
        Only return valid JSON, no other text.`;

        // Call Gemini API
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: prompt },
                    ...base64Images.map((img) => ({
                      inlineData: {
                        data: img.data,
                        mimeType: img.mimeType,
                      },
                    })),
                  ],
                },
              ],
            }),
          }
        );

        const data = await response.json();
        const responseText = data.candidates[0].content.parts[0].text;

        // Extract JSON from markdown if present
        const jsonMatch = responseText.match(
          /```(?:json)?\s*(\{[\s\S]*?\})\s*```/
        );
        const jsonStr = jsonMatch ? jsonMatch[1] : responseText;

        try {
          const result = JSON.parse(jsonStr);

          if (result.prizesWon) {
            setPrizes(result.prizes);
            setCurrentStep(2);
            setIsLoading(false);

            // Move to transaction step after showing prizes with random delay
            setTimeout(() => {
              setIsLoading(true);
              // Random delay between 2-4 seconds before moving to step 3
              setTimeout(() => {
                setCurrentStep(3);
                setIsLoading(true);
                // Random delay between 1-3 seconds before showing metamask
                setTimeout(() => {
                  setShowMetamask(true);
                  setIsLoading(false);
                }, Math.random() * 2000 + 1000);
              }, Math.random() * 2000 + 2000);
            }, 2000);
          } else {
            setVerificationFailed(true);
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Error parsing Gemini response:", error);
          setVerificationFailed(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error verifying with Gemini:", error);
        setVerificationFailed(true);
        setIsLoading(false);
      }
    };

    verifyWithGemini();
  }, [open, screenshots]);

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Processing Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-6">
          {steps.map((step) => {
            const isCurrentStep = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            const isActive = step.id <= currentStep;

            return (
              <div key={step.id} className="flex items-center space-x-4">
                {/* Step Number/Icon */}
                <div className="relative">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white transition-all duration-500 ease-in-out transform ${
                      isCompleted
                        ? step.color
                        : isCurrentStep
                        ? step.color
                        : "bg-gray-200"
                    } ${isCurrentStep ? "scale-110" : "scale-100"}`}
                  >
                    {isCurrentStep && isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      step.id
                    )}
                  </div>
                </div>

                {/* Step Content */}
                <div
                  className={`flex-1 p-4 rounded-lg transition-all duration-500 ease-in-out transform ${
                    isActive ? step.bgColor : "bg-gray-50"
                  } ${isCurrentStep ? "scale-[1.02]" : "scale-100"}`}
                >
                  <div className="flex justify-between items-center">
                    <div
                      className={`font-medium transition-colors duration-500 ${
                        isActive ? step.textColor : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </div>
                    {isCompleted && (
                      <CheckCircle
                        className={`w-6 h-6 ${step.textColor} transition-all duration-500 ease-in-out transform scale-100 ml-3`}
                      />
                    )}
                  </div>
                  {isCurrentStep && isLoading && (
                    <div className="text-sm text-gray-500 mt-1 animate-pulse">
                      Processing...
                    </div>
                  )}

                  {/* Show prizes when verified */}
                  {step.id === 2 && prizes.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {prizes.map((prize, index) => (
                        <div
                          key={index}
                          className="bg-white p-3 rounded-lg shadow-sm border border-green-100 flex justify-between items-center animate-fadeIn"
                        >
                          <span className="font-medium text-gray-800">
                            {prize.name}
                          </span>
                          <span className="text-green-600 font-semibold">
                            {prize.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Show metamask button in step 3 */}
                  {step.id === 3 &&
                    showMetamask &&
                    writeContract({
                      abi,
                      address: config[chainId].address as `0x${string}`,
                      functionName: "submitReview",
                      args: [
                        organization,
                        hackathon,
                        title,
                        description,
                        rating,
                        [], // evidenceHashes - empty array for now
                        BigInt(prizeAmount || "0"),
                        endDate
                          ? BigInt(new Date(endDate).getTime() / 1000)
                          : BigInt(0),
                        prizePaidOut,
                        prizePaidOut
                          ? BigInt(new Date().getTime() / 1000)
                          : BigInt(0),
                      ],
                    })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Show close button for verification failure */}
        {verificationFailed && (
          <div className="text-center space-y-4">
            <p className="text-red-600">
              No prizes found in the provided screenshots.
            </p>
            <Button
              onClick={handleClose}
              className="bg-gray-600 hover:bg-gray-700 text-white px-8"
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
