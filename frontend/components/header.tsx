"use client"

import { Button } from "@/components/ui/button"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Header() {
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  return (
    <header className="border-b border-gray-100">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex-1 flex justify-center md:justify-start">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl">🙏</span>
            <span className="text-xl font-medium text-gray-900">PayMePrettyPlease</span>
          </Link>
        </div>

        {isHomePage && (
          <div className="flex items-center space-x-4">
            <Link href="/app">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full px-6">
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
  )
}
