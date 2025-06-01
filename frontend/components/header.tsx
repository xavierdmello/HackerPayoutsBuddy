"use client";

import { Button } from "@/components/ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <header className="border-b border-gray-100">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex-1 flex justify-center md:justify-start">
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/icon.png"
              alt="HackerPayoutsBuddy Icon"
              width={40}
              height={40}
              className="h-10 w-10"
              priority
            />
            <Image
              src="/logo.png"
              alt="HackerPayoutsBuddy Logo"
              width={200}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>
        </div>

        {isHomePage && (
          <div className="flex items-center space-x-4">
            <Link href="/app">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-full px-8 py-2.5 text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md">
                Go to App
              </Button>
            </Link>
          </div>
        )}

        {!isHomePage && (
          <div className="flex items-center space-x-4">
            <ConnectButton />
          </div>
        )}
      </div>
    </header>
  );
}
