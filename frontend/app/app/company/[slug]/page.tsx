"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Star,
  Clock,
  AlertTriangle,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";
import { Header } from "@/components/header";
import { SubmitReportButton } from "@/components/submit-report-button";
import { Reviews } from "@/components/reviews";
import Link from "next/link";
import { useChainId, useReadContract } from "wagmi";
import config from "@/app/config";
import { abi } from "@/app/abi";
import { use } from "react";

// Helper function to format timestamp to relative time
const formatRelativeTime = (timestamp: bigint) => {
  const now = BigInt(Math.floor(Date.now() / 1000));
  const diff = now - timestamp;
  const days = Number(diff) / (24 * 60 * 60);

  if (days < 1) return "today";
  if (days < 2) return "yesterday";
  if (days < 7) return `${Math.floor(days)} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
};

// Helper function to calculate average payout time
const calculateAvgPayoutTime = (
  totalPayoutTime: bigint,
  paidOutReviews: bigint
) => {
  if (paidOutReviews === 0n) return "No payouts yet";
  const avgDays =
    Number(totalPayoutTime) / (Number(paidOutReviews) * 24 * 60 * 60);
  return `${Math.round(avgDays)} days`;
};

// Helper function to format pending time with color
const formatPendingTime = (hackathonEndDate: bigint) => {
  const now = BigInt(Math.floor(Date.now() / 1000));
  const diff = now - hackathonEndDate;
  const days = Number(diff) / (24 * 60 * 60);

  let colorClass = "";
  if (days < 10) {
    colorClass = "text-blue-600";
  } else if (days < 30) {
    colorClass = "text-amber-600";
  } else {
    colorClass = "text-red-600";
  }

  return {
    text: `${Math.floor(days)} days pending`,
    colorClass,
  };
};

// Helper function to format date
const formatDate = (timestamp: bigint) => {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function CompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const chainId = useChainId();
  const { data: companyData } = useReadContract({
    abi,
    address: config[chainId].address,
    functionName: "getOrganization",
    args: [slug],
  });

  const { data: reviewsData } = useReadContract({
    abi,
    address: config[chainId].address,
    functionName: "getAllReviewsFromSponsor",
    args: [slug],
  });

  if (!companyData || !reviewsData) {
    return <div>Loading...</div>;
  }

  const [
    name,
    avgPayoutTime,
    rating,
    totalReviews,
    lastReviewTimestamp,
    pendingPayouts,
    paidOutReviews,
  ] = companyData;

  // Transform reviews data into the format our UI expects
  const reviews = reviewsData.map((review: any) => {
    const pendingTime = !review.prizePaidOut
      ? formatPendingTime(review.hackathonEndDate)
      : null;

    return {
      id: review.sponsor,
      rating: Number(review.rating),
      comment: review.comment,
      evidence:
        review.evidenceHashes.length > 0
          ? "Evidence provided"
          : "No evidence provided",
      hasPhoto: review.evidenceHashes.length > 0,
      time: review.prizePaidOut
        ? formatRelativeTime(review.hackathonEndDate)
        : pendingTime?.text,
      timeColorClass: pendingTime?.colorClass,
      anonymous: true,
      verified: review.prizePaidOut,
      prizeAmount: Number(review.prizeAmount),
      prizePaidOut: review.prizePaidOut,
      hackathonEndDate: formatDate(review.hackathonEndDate),
    };
  });

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <Link
          href="/app"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Companies
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Header */}
            <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {name}
                    </h1>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star
                          className={`w-5 h-5 fill-current ${getRatingColor(
                            Number(rating)
                          )}`}
                        />
                        <span
                          className={`text-xl font-semibold ${getRatingColor(
                            Number(rating)
                          )}`}
                        >
                          {Number(rating)}
                        </span>
                        <span className="text-gray-500">
                          ({Number(totalReviews)} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                  <SubmitReportButton companyName={name} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-lg font-semibold text-gray-900">
                      {calculateAvgPayoutTime(avgPayoutTime, paidOutReviews)}
                    </div>
                    <div className="text-sm text-gray-500">Avg Payout Time</div>
                  </div>

                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                    <div className="text-lg font-semibold text-gray-900">
                      {Number(pendingPayouts)}
                    </div>
                    <div className="text-sm text-gray-500">Pending Payouts</div>
                  </div>

                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <div className="text-lg font-semibold text-gray-900">
                      {Number(totalReviews)}
                    </div>
                    <div className="text-sm text-gray-500">Total Reviews</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Reviews reviews={reviews} title="Reviews" showEvidence={true} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rating Breakdown - We'll need to implement this with real data later */}
            <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Rating Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center text-gray-500">
                  Rating breakdown coming soon
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
