import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Star,
  MessageSquare,
  Camera,
  CheckCircle,
  Clock,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";

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
}

interface ReviewsProps {
  reviews: Review[];
  title?: string;
  showEvidence?: boolean;
}

export function Reviews({
  reviews,
  title = "Reviews",
  showEvidence = false,
}: ReviewsProps) {
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
            className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
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
              <div className="text-right">
                {review.time && (
                  <div className="flex items-center justify-end space-x-1">
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
                      {review.time}
                    </div>
                  </div>
                )}
                {review.hackathonEndDate && (
                  <div className="text-xs text-gray-500">
                    Hackathon End Date: {review.hackathonEndDate}
                  </div>
                )}
              </div>
            </div>
            <div className="mb-2">
              <div className="text-sm font-medium text-gray-900 mb-1">
                {review.eventName}
              </div>
              <div className="text-sm font-semibold text-gray-900 mb-1">
                {review.title}
              </div>
              <p className="text-sm text-gray-600">{review.comment}</p>
            </div>
            {showEvidence && review.evidence && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 font-medium mb-1">
                  Evidence:
                </p>
                <p className="text-xs text-gray-600">{review.evidence}</p>
              </div>
            )}
            <div className="text-xs text-gray-400 flex items-center space-x-2">
              <span>
                {review.anonymous ? "Anonymous User" : "Verified User"}
              </span>
              {review.verified && (
                <CheckCircle className="w-3 h-3 text-blue-500" />
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
