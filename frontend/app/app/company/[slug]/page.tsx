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

// Mock data - in real app this would come from API based on slug
const companyData = {
  ethglobal: {
    name: "ETHGlobal",
    avgPayoutTime: "7 days",
    rating: 4.8,
    totalReviews: 156,
    pendingPayouts: 3,
    ratingBreakdown: {
      5: 120,
      4: 25,
      3: 8,
      2: 2,
      1: 1,
    },
  },
  treehacks: {
    name: "TreeHacks",
    avgPayoutTime: "240 days",
    rating: 1.2,
    totalReviews: 43,
    pendingPayouts: 12,
    ratingBreakdown: {
      5: 1,
      4: 2,
      3: 3,
      2: 5,
      1: 32,
    },
  },
  ethdenver: {
    name: "ETHDenver",
    avgPayoutTime: "90 days",
    rating: 2.1,
    totalReviews: 78,
    pendingPayouts: 8,
    ratingBreakdown: {
      5: 5,
      4: 8,
      3: 12,
      2: 18,
      1: 35,
    },
  },
};

const mockReviews = [
  {
    id: "1",
    rating: 5,
    comment:
      "Paid within 3 days of announcement. Excellent communication throughout the process. They even sent a follow-up email to confirm receipt.",
    evidence:
      "Email confirmation showing payment processed on March 15th, 2024. Prize amount: $5,000 for 1st place in DeFi track.",
    hasPhoto: true,
    time: "2 days ago",
    anonymous: false,
    verified: true,
  },
  {
    id: "2",
    rating: 1,
    comment:
      "Still waiting after 8 months. No response to emails. This is completely unacceptable for a major hackathon.",
    evidence:
      "Screenshots of unanswered emails sent to organizers. Last response was in July 2024 saying 'payment processing soon'.",
    hasPhoto: true,
    time: "1 week ago",
    anonymous: true,
    verified: true,
  },
  {
    id: "3",
    rating: 4,
    comment:
      "Took 2 weeks but they kept us updated every few days. Professional handling overall.",
    evidence:
      "Payment confirmation and communication timeline showing regular updates from organizers.",
    hasPhoto: false,
    time: "3 weeks ago",
    anonymous: false,
    verified: false,
  },
  {
    id: "4",
    rating: 1,
    comment:
      "Sent my $11,000 prize to the wrong person initially. Took 3 months to fix their mistake. How does this even happen?",
    evidence:
      "Bank statements showing incorrect initial transfer and eventual correction. Email thread with organizers acknowledging the error.",
    hasPhoto: true,
    time: "1 month ago",
    anonymous: true,
    verified: true,
  },
];

export default function CompanyPage({ params }: { params: { slug: string } }) {
  const company = companyData[params.slug as keyof typeof companyData];

  if (!company) {
    return <div>Company not found</div>;
  }

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
                      {company.name}
                    </h1>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star
                          className={`w-5 h-5 fill-current ${getRatingColor(
                            company.rating
                          )}`}
                        />
                        <span
                          className={`text-xl font-semibold ${getRatingColor(
                            company.rating
                          )}`}
                        >
                          {company.rating}
                        </span>
                        <span className="text-gray-500">
                          ({company.totalReviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                  <SubmitReportButton companyName={company.name} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-lg font-semibold text-gray-900">
                      {company.avgPayoutTime}
                    </div>
                    <div className="text-sm text-gray-500">Avg Payout Time</div>
                  </div>

                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                    <div className="text-lg font-semibold text-gray-900">
                      {company.pendingPayouts}
                    </div>
                    <div className="text-sm text-gray-500">Pending Payouts</div>
                  </div>

                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <div className="text-lg font-semibold text-gray-900">
                      {company.totalReviews}
                    </div>
                    <div className="text-sm text-gray-500">Total Reviews</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Reviews
              reviews={mockReviews}
              title="Anonymized Reports & Evidence"
              showEvidence={true}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rating Breakdown */}
            <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Rating Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count =
                    company.ratingBreakdown[
                      stars as keyof typeof company.ratingBreakdown
                    ];
                  const percentage = (count / company.totalReviews) * 100;

                  return (
                    <div key={stars} className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1 w-12">
                        <span className="text-sm text-gray-600">{stars}</span>
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            stars >= 4
                              ? "bg-green-500"
                              : stars >= 3
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-8">{count}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
