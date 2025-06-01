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
import { useChainId, useWriteContract, useTransaction } from "wagmi";
import { abi } from "@/app/abi";
import config from "../app/config";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";
import {
  flowMainnet,
  flowTestnet,
  flareTestnet,
  rootstockTestnet,
  hederaTestnet,
} from "wagmi/chains";

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
  payoutDate: string;
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
  payoutDate,
}: AiAgentModalProps) {
  const {
    writeContract,
    data: txHash,
    isSuccess: isWriteSuccess,
  } = useWriteContract();
  const chainId = useChainId();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationFailed, setVerificationFailed] = useState(false);
  const [prizes, setPrizes] = useState<PrizeCard[]>([]);
  const [visiblePrizes, setVisiblePrizes] = useState<number[]>([]);
  const [showMetamask, setShowMetamask] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  // Watch transaction status
  const { isSuccess: txSuccess } = useTransaction({
    hash: txHash,
    chainId,
  });

  // Show confetti when transaction succeeds
  useEffect(() => {
    if (txSuccess) {
      setShowConfetti(true);
      // Stop confetti after 5 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [txSuccess]);

  // Get etherscan base URL based on chain
  const getEtherscanBaseUrl = () => {
    if (!txHash) return "";
    switch (chainId) {
      case flowMainnet.id:
        return `https://www.flowscan.io/tx/${txHash}`;
      case flowTestnet.id:
        return `https://testnet.flowscan.io/tx/${txHash}`;
      case flareTestnet.id:
        return `https://testnet.flarescan.com/tx/${txHash}?chainid=114`;
      case rootstockTestnet.id:
        return `https://explorer.testnet.rootstock.io/tx/${txHash}`;
      case hederaTestnet.id:
        return `https://hashscan.io/testnet/transaction/${txHash}`;
      default:
        return `https://etherscan.io/tx/${txHash}`;
    }
  };

  // Function to reveal prizes sequentially
  const revealPrizesSequentially = (prizes: PrizeCard[]) => {
    setPrizes(prizes);
    setVisiblePrizes([]);

    prizes.forEach((_, index) => {
      setTimeout(() => {
        setVisiblePrizes((prev) => [...prev, index]);
        // If this is the last prize, move to step 3 after a delay
        if (index === prizes.length - 1) {
          setTimeout(() => {
            setCurrentStep(3);
            setIsLoading(true);
            // Random delay before showing metamask
            setTimeout(async () => {
              if (!hasSubmitted) {
                setHasSubmitted(true);
                try {
                  await writeContract({
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
                        ? BigInt(Math.floor(new Date(endDate).getTime() / 1000))
                        : BigInt(0),
                      prizePaidOut,
                      prizePaidOut && payoutDate
                        ? BigInt(
                            Math.floor(new Date(payoutDate).getTime() / 1000)
                          )
                        : BigInt(0),
                    ],
                  });
                } catch (error) {
                  console.error("Error submitting transaction:", error);
                }
              }
              setIsLoading(false);
              setShowMetamask(true);
            }, Math.random() * 2000 + 1000);
          }, 1000);
        }
      }, index * 1000); // Show each prize 1 second apart
    });
  };

  useEffect(() => {
    if (!open) {
      // Reset state when modal closes
      setCurrentStep(1);
      setIsLoading(true);
      setVerificationFailed(false);
      setPrizes([]);
      setVisiblePrizes([]);
      setShowMetamask(false);
      setHasSubmitted(false);
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
        1. Verify if they show hackathon prize wins (look for prize names, or winning notifications)
        2. Extract the prize names if found
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
            setCurrentStep(2);
            revealPrizesSequentially(result.prizes);
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
    <>
      {showConfetti && (
        <ReactConfetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          tweenDuration={5000}
        />
      )}
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold">
              Prize Verification Agent
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-6">
            {steps.map((step) => {
              const isCurrentStep = step.id === currentStep;
              const isCompleted =
                step.id < currentStep || (step.id === 3 && txSuccess);
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
                      {(isCurrentStep &&
                        (isLoading ||
                          (step.id === 2 &&
                            visiblePrizes.length < prizes.length))) ||
                      (step.id === 3 && !txSuccess && showMetamask) ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
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
                        {step.id === 3 && txSuccess
                          ? "Review Verified & Submitted!"
                          : step.title}
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

                    {/* Show screenshots in step 1 */}
                    {step.id === 1 && screenshots.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {screenshots.map((file, index) => (
                          <div
                            key={index}
                            className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden"
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Screenshot ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Show prizes when verified */}
                    {step.id === 2 && prizes.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {prizes.map((prize, index) => (
                          <div
                            key={index}
                            className={`bg-white p-3 rounded-lg shadow-sm border border-green-100 flex justify-between items-center transition-all duration-500 ${
                              visiblePrizes.includes(index)
                                ? "opacity-100 transform translate-y-0"
                                : "opacity-0 transform translate-y-4"
                            }`}
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

                    {/* Show transaction status in step 3 */}
                    {step.id === 3 && showMetamask && (
                      <div className="mt-2 space-y-2">
                        {!txSuccess ? (
                          <div className="text-sm text-gray-500">
                            {isWriteSuccess
                              ? "Waiting for transaction confirmation..."
                              : "Please confirm the transaction in your wallet..."}
                          </div>
                        ) : (
                          <div className="text-sm space-y-2">
                            <a
                              href={getEtherscanBaseUrl()}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              View on Etherscan
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Show close button for verification failure or completion */}
          {(verificationFailed || txSuccess) && (
            <div className="text-center space-y-4">
              {verificationFailed && (
                <p className="text-red-600">
                  No prizes found in the provided screenshots.
                </p>
              )}
              <Button
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700 text-white px-8"
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
