import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Shield,
  Users,
  Clock,
  DollarSign,
  Star,
} from "lucide-react";
import { Header } from "@/components/header";
import Link from "next/link";

export default function HackerPayoutsLanding() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-blue-100 text-blue-600 border-blue-200 px-3 py-1 rounded-full">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Transparency Crisis
              </Badge>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                The future of hackathon accountability is here
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                We're the most trusted place for hackers to report, track, and
                verify hackathon prize payouts.
              </p>
            </div>

            <Link href="/app" className="mt-8 block">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-full px-8 py-3 text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md animate-pulse-subtle">
                Submit Your First Report
              </Button>
            </Link>
          </div>

          {/* Dashboard Preview */}
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100 rounded-full opacity-50"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-100 rounded-full opacity-50"></div>

            <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl overflow-hidden relative z-10">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Recent Reports
                    </h3>
                    <Badge className="bg-red-100 text-red-600 border-red-200">
                      Live
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">
                          TreeHacks 2024
                        </div>
                        <div className="text-sm text-gray-500">
                          8 months payout delay
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className="w-4 h-4 fill-red-500 text-red-500"
                            />
                          ))}
                        </div>
                        <span className="text-red-600 font-semibold">1.2</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">
                          ETHDenver 2024
                        </div>
                        <div className="text-sm text-gray-500">
                          Wrong recipient, 3mo delay
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[1, 2].map((star) => (
                            <Star
                              key={star}
                              className="w-4 h-4 fill-red-500 text-red-500"
                            />
                          ))}
                          {[3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className="w-4 h-4 text-gray-300"
                            />
                          ))}
                        </div>
                        <span className="text-red-600 font-semibold">2.1</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">
                          ETHGlobal NYC
                        </div>
                        <div className="text-sm text-gray-500">
                          Paid on time, transparent
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className="w-4 h-4 fill-green-500 text-green-500"
                            />
                          ))}
                        </div>
                        <span className="text-green-600 font-semibold">
                          4.8
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900">127</div>
                <div className="text-gray-500">Days avg delay</div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
              <CardContent className="p-6 text-center">
                <DollarSign className="w-8 h-8 text-red-500 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900">$2.3M</div>
                <div className="text-gray-500">Unpaid prizes</div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-orange-500 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900">43</div>
                <div className="text-gray-500">Active reports</div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900">1,247</div>
                <div className="text-gray-500">Verified hackers</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Bringing Transparency to Hackathons
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            No more broken promises, delayed payouts, or embezzled funds. Public
            accountability creates better hackathons for everyone.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
            <CardContent className="p-8">
              <Shield className="w-12 h-12 text-blue-600 mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Anonymous Reporting
              </h3>
              <p className="text-gray-600">
                Report issues without fear of retaliation. Your identity stays
                protected while your voice creates change.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
            <CardContent className="p-8">
              <Star className="w-12 h-12 text-blue-600 mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Public Reviews
              </h3>
              <p className="text-gray-600">
                Rate hackathons on payout speed, transparency, and organization.
                Help others make informed decisions.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
            <CardContent className="p-8">
              <Clock className="w-12 h-12 text-blue-600 mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Payout Tracking
              </h3>
              <p className="text-gray-600">
                Track prize distribution timelines and hold organizers
                accountable to their promises and deadlines.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Start your accountability journey today
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of hackers demanding transparency and
              accountability. Together, we can make hackathons better for
              everyone.
            </p>
            <Link href="/app">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-full px-8 py-3 text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md animate-pulse-subtle">
                Submit Your First Report
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2025 Xavier D'Mello</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
