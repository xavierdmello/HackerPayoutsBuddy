"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  Star,
  MessageSquare,
  TrendingDown,
  TrendingUp,
  Plus,
  Turtle,
  Rabbit,
} from "lucide-react";
import { Header } from "@/components/header";
import Link from "next/link";
import { SubmitReportButton } from "@/components/submit-report-button";
import { useBlockNumber, useChainId, useReadContract } from "wagmi";
import config from "../config";
import { abi } from "../abi";
import { useEffect, useState } from "react";

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

// Helper function to calculate rating
const calculateRating = (totalRating: bigint, totalReviews: bigint) => {
  if (totalReviews === 0n) return 0;
  return Number(totalRating) / Number(totalReviews);
};

export default function AppPage() {
  const chainId = useChainId();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: companiesData, refetch: refetchCompanies } = useReadContract({
    abi,
    address: config[chainId].address,
    functionName: "getAllOrganizations",
    query: {
      staleTime: 0,
    },
  });
  // hi

  const { data: blockNumber } = useBlockNumber({
    chainId: chainId,
    watch: true, // Automatically update on new blocks
  }); //dhdg

  useEffect(() => {
    if (blockNumber) {
      refetchCompanies();
    }
  }, [blockNumber]);

  const companies =
    companiesData?.map((company: any) => ({
      name: company.name,
      avgPayoutTime: calculateAvgPayoutTime(
        company.totalPayoutTime,
        company.paidOutReviews
      ),
      rating: calculateRating(company.totalRating, company.totalReviews),
      reviewCount: Number(company.totalReviews),
      lastReview: formatRelativeTime(company.lastReviewTimestamp),
      status: company.pendingPayouts > 0n ? "bad" : "good",
    })) || [];

  // Filter companies based on search query
  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort companies by payout time for quickest/slowest lists
  const sortedByPayoutTime = [...filteredCompanies].sort((a, b) => {
    // Convert "X days" to number, handle "No payouts yet"
    const getPayoutDays = (time: string) => {
      if (time === "No payouts yet") return Infinity;
      return parseInt(time.split(" ")[0]);
    };
    return getPayoutDays(a.avgPayoutTime) - getPayoutDays(b.avgPayoutTime);
  });
  const quickestPayers = sortedByPayoutTime.slice(0, 3);
  const slowestPayers = [...sortedByPayoutTime].reverse().slice(0, 3);

  // Get recent reviews (we'll need to implement this with real data later)
  const recentReviews = [
    {
      hackathon: "ETHGlobal NYC",
      rating: 5,
      comment: "Paid within 3 days, excellent communication",
      time: "2h ago",
    },
    {
      hackathon: "TreeHacks",
      rating: 1,
      comment: "Still waiting after 8 months, no response",
      time: "4h ago",
    },
    {
      hackathon: "HackMIT",
      rating: 4,
      comment: "Took 2 weeks but they kept us updated",
      time: "6h ago",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search */}
            <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search hackathons..."
                      className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <SubmitReportButton />
                </div>
              </CardContent>
            </Card>

            {/* Companies Table */}
            <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Hackathon Companies
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Table Headers */}
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-700">
                          Company
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-700 w-32">
                        Avg. Payout Time
                      </div>
                      <div className="text-sm font-medium text-gray-700 w-20">
                        Rating
                      </div>
                      <div className="text-sm font-medium text-gray-700 w-20">
                        Reviews
                      </div>
                      <div className="text-sm font-medium text-gray-700 w-24">
                        Last Review
                      </div>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {filteredCompanies.length > 0 ? (
                    filteredCompanies.map((company, index) => (
                      <Link
                        key={index}
                        href={`/app/company/${company.name.replace(
                          /\s+/g,
                          "-"
                        )}`}
                        className="block hover:bg-gray-50 transition-colors"
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 flex-1">
                              <div className="flex-1">
                                <div className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                                  {company.name}
                                </div>
                              </div>

                              <div className="text-sm text-gray-600 w-32">
                                {company.avgPayoutTime}
                              </div>

                              <div className="flex items-center space-x-1 w-20">
                                <Star
                                  className={`w-4 h-4 ${
                                    company.rating >= 4
                                      ? "fill-green-500 text-green-500"
                                      : company.rating >= 3
                                      ? "fill-yellow-500 text-yellow-500"
                                      : "fill-red-500 text-red-500"
                                  }`}
                                />
                                <span
                                  className={`text-sm font-medium ${
                                    company.rating >= 4
                                      ? "text-green-600"
                                      : company.rating >= 3
                                      ? "text-yellow-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {company.rating}
                                </span>
                              </div>

                              <div className="text-sm text-gray-500 w-20">
                                {company.reviewCount} reviews
                              </div>

                              <div className="text-sm text-gray-500 w-24">
                                {company.lastReview}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      No companies found matching "{searchQuery}"
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Reviews */}
            <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Recent Reviews
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentReviews.map((review, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-sm text-gray-900">
                        {review.hackathon}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star
                          className={`w-3 h-3 ${
                            review.rating >= 4
                              ? "fill-green-500 text-green-500"
                              : "fill-red-500 text-red-500"
                          }`}
                        />
                        <span className="text-xs text-gray-500">
                          {review.time}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Slowest Payers */}
            <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <Turtle className="w-5 h-5 mr-2 text-red-500" />
                  Slowest Payouts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {slowestPayers.map((company, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-sm text-gray-900">
                        {company.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {company.avgPayoutTime}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-red-600 font-medium">
                        {company.avgPayoutTime}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quickest Payers */}
            <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <Rabbit className="w-5 h-5 mr-2 text-green-500" />
                  Quickest Payouts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickestPayers.map((company, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-sm text-gray-900">
                        {company.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {company.avgPayoutTime}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-green-600 font-medium">
                        {company.avgPayoutTime}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
