import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Star,
  MessageSquare,
  Camera,
  CheckCircle,
  Clock,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import { useWriteContract } from "wagmi";
import { abi } from "../app/abi";
import config from "../app/config";

interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  eventName: string;
  evidence?: string;
  hasPhoto?: boolean;
  time?: string;
  timeColorClass?: string;
  anonymous: boolean;
  verified?: boolean;
  prizeAmount?: number;
  prizePaidOut?: boolean;
  hackathonEndDate?: string;
  payoutDate?: number;
  hackathonEndDateTimestamp?: number;
  reviewer?: string;
}

interface ReviewsProps {
  reviews: Review[];
  title?: string;
  showEvidence?: boolean;
  isUserReviews?: boolean;
}

export function Reviews({
  reviews,
  title = "Anonymous Reviews",
  showEvidence = false,
  isUserReviews = false,
}: ReviewsProps) {
  const { writeContract } = useWriteContract();

  const handleConfirmPayout = (reviewId: string) => {
    console.log("Review ID in handleConfirmPayout:", reviewId, typeof reviewId);
    writeContract({
      abi,
      address: config[296].address as `0x${string}`,
      functionName: "markPrizePaidOut",
      args: [BigInt(reviewId)],
    });
  };

  const calculatePayoutTime = (
    payoutDate: number,
    hackathonEndDate: number
  ): { days: number; colorClass: string; icon: JSX.Element } => {
    if (!payoutDate || !hackathonEndDate)
      return {
        days: 0,
        colorClass: "text-gray-500",
        icon: <Clock className="w-4 h-4 text-gray-500" />,
      };

    const days = Math.floor((payoutDate - hackathonEndDate) / (24 * 60 * 60));

    // Define thresholds for different severity levels
    if (days <= 14) {
      // Within 2 weeks is good
      return {
        days,
        colorClass: "text-green-600",
        icon: <CheckCircle className="w-4 h-4 text-green-600" />,
      };
    } else if (days <= 30) {
      // Within a month is concerning
      return {
        days,
        colorClass: "text-amber-600",
        icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
      };
    } else {
      // More than a month is bad
      return {
        days,
        colorClass: "text-red-600",
        icon: <AlertCircle className="w-4 h-4 text-red-600" />,
      };
    }
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            onClick={() =>
              console.log(
                "Review ID in render:",
                review.id,
                "Full review object:",
                review
              )
            }
            className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="text-xs text-gray-500 mb-1 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span>{review.eventName}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    review.prizePaidOut
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {review.prizePaidOut ? "Paid" : "Unpaid"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {review.prizePaidOut ? (
                  <>
                    {(() => {
                      const payoutInfo = calculatePayoutTime(
                        review.payoutDate!,
                        review.hackathonEndDateTimestamp!
                      );
                      return (
                        <>
                          {payoutInfo.icon}
                          <div
                            className={`text-sm font-bold ${payoutInfo.colorClass}`}
                          >
                            Took {payoutInfo.days} days to pay
                          </div>
                        </>
                      );
                    })()}
                  </>
                ) : (
                  <>
                    {review.timeColorClass &&
                      (review.timeColorClass.includes("blue") ? (
                        <Clock className="w-4 h-4 text-blue-600" />
                      ) : review.timeColorClass.includes("amber") ? (
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                      ) : review.timeColorClass.includes("red") ? (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      ) : null)}
                    <div
                      className={`text-sm font-bold ${
                        review.timeColorClass || "text-gray-500"
                      }`}
                    >
                      {review.time} (Unpaid)
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-6 h-6 ${
                        star <= review.rating
                          ? review.rating >= 4
                            ? "fill-green-500 text-green-500"
                            : review.rating >= 3
                            ? "fill-yellow-500 text-yellow-500"
                            : "fill-red-500 text-red-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                {review.hasPhoto && (
                  <Camera className="w-4 h-4 text-gray-400" />
                )}
                {review.verified && (
                  <div className="relative group">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Verified by Flare
                    </div>
                  </div>
                )}
              </div>
              {review.hackathonEndDate && (
                <div className="text-xs text-gray-500">
                  Hackathon End Date: {review.hackathonEndDate}
                </div>
              )}
            </div>
            <div className="mt-4 mb-2">
              <div className="text-base font-semibold text-gray-900 mb-1">
                {review.title}
              </div>
              <p className="text-sm text-gray-600">{review.comment}</p>
            </div>
            {showEvidence && (
              <div className="bg-gray-50 p-3 rounded-lg">
                {review.hasPhoto ? (
                  <>
                    <p className="text-xs text-gray-600 font-medium mb-1">
                      Images:
                    </p>
                    <p className="text-xs text-gray-600">{review.evidence}</p>
                  </>
                ) : (
                  <p className="text-xs text-gray-600">No images provided</p>
                )}
              </div>
            )}
            {isUserReviews && !review.prizePaidOut && (
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={() => handleConfirmPayout(review.id)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Confirm Payout Received
                </Button>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
