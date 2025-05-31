import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Star, MessageSquare, TrendingDown, TrendingUp, Plus } from "lucide-react"
import { Header } from "@/components/header"
import Link from "next/link"

const companies = [
  {
    name: "ETHGlobal",
    avgPayoutTime: "7 days",
    rating: 4.8,
    reviewCount: 156,
    lastReview: "2 days ago",
    status: "good",
  },
  {
    name: "TreeHacks",
    avgPayoutTime: "240 days",
    rating: 1.2,
    reviewCount: 43,
    lastReview: "1 week ago",
    status: "bad",
  },
  {
    name: "ETHDenver",
    avgPayoutTime: "90 days",
    rating: 2.1,
    reviewCount: 78,
    lastReview: "3 days ago",
    status: "bad",
  },
  {
    name: "HackMIT",
    avgPayoutTime: "14 days",
    rating: 4.2,
    reviewCount: 89,
    lastReview: "5 days ago",
    status: "good",
  },
  {
    name: "PennApps",
    avgPayoutTime: "21 days",
    rating: 3.8,
    reviewCount: 67,
    lastReview: "1 day ago",
    status: "neutral",
  },
  {
    name: "CalHacks",
    avgPayoutTime: "180 days",
    rating: 1.8,
    reviewCount: 34,
    lastReview: "4 days ago",
    status: "bad",
  },
]

const recentReviews = [
  { hackathon: "ETHGlobal NYC", rating: 5, comment: "Paid within 3 days, excellent communication", time: "2h ago" },
  { hackathon: "TreeHacks", rating: 1, comment: "Still waiting after 8 months, no response", time: "4h ago" },
  { hackathon: "HackMIT", rating: 4, comment: "Took 2 weeks but they kept us updated", time: "6h ago" },
]

const worstOffenders = [
  { name: "TreeHacks", avgDelay: "240 days", rating: 1.2 },
  { name: "CalHacks", avgDelay: "180 days", rating: 1.8 },
  { name: "ETHDenver", avgDelay: "90 days", rating: 2.1 },
]

const bestCompanies = [
  { name: "ETHGlobal", avgPayout: "7 days", rating: 4.8 },
  { name: "HackMIT", avgPayout: "14 days", rating: 4.2 },
  { name: "PennApps", avgPayout: "21 days", rating: 3.8 },
]

export default function AppPage() {
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
                    />
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Submit Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Companies Table */}
            <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Hackathon Companies</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Table Headers */}
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-700">Company</span>
                      </div>
                      <div className="text-sm font-medium text-gray-700 w-24">Avg Payout</div>
                      <div className="text-sm font-medium text-gray-700 w-20">Rating</div>
                      <div className="text-sm font-medium text-gray-700 w-20">Reviews</div>
                      <div className="text-sm font-medium text-gray-700 w-24">Last Review</div>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {companies.map((company, index) => (
                    <div key={index} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <Link
                            href={`/app/company/${company.name.toLowerCase().replace(/\s+/g, "-")}`}
                            className="flex-1 hover:text-blue-600"
                          >
                            <div className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                              {company.name}
                            </div>
                          </Link>

                          <div className="text-sm text-gray-600 w-24">{company.avgPayoutTime}</div>

                          <div className="flex items-center space-x-1 w-20">
                            <Star
                              className={`w-4 h-4 ${company.rating >= 4 ? "fill-green-500 text-green-500" : company.rating >= 3 ? "fill-yellow-500 text-yellow-500" : "fill-red-500 text-red-500"}`}
                            />
                            <span
                              className={`text-sm font-medium ${company.rating >= 4 ? "text-green-600" : company.rating >= 3 ? "text-yellow-600" : "text-red-600"}`}
                            >
                              {company.rating}
                            </span>
                          </div>

                          <div className="text-sm text-gray-500 w-20">{company.reviewCount} reviews</div>

                          <div className="text-sm text-gray-500 w-24">{company.lastReview}</div>
                        </div>
                      </div>
                    </div>
                  ))}
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
                  <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-sm text-gray-900">{review.hackathon}</div>
                      <div className="flex items-center space-x-1">
                        <Star
                          className={`w-3 h-3 ${review.rating >= 4 ? "fill-green-500 text-green-500" : "fill-red-500 text-red-500"}`}
                        />
                        <span className="text-xs text-gray-500">{review.time}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Worst Offenders */}
            <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <TrendingDown className="w-5 h-5 mr-2 text-red-500" />
                  Worst Offenders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {worstOffenders.map((company, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm text-gray-900">{company.name}</div>
                      <div className="text-xs text-gray-500">{company.avgDelay} avg</div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-red-500 text-red-500" />
                      <span className="text-sm text-red-600 font-medium">{company.rating}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Best Companies */}
            <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                  Best Companies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {bestCompanies.map((company, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm text-gray-900">{company.name}</div>
                      <div className="text-xs text-gray-500">{company.avgPayout} avg</div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-green-500 text-green-500" />
                      <span className="text-sm text-green-600 font-medium">{company.rating}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
