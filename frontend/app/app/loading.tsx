export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-full" />
                </div>
                <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-32" />
              </div>
            </div>

            {/* Companies Table */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
              <div className="p-6 border-b border-gray-200">
                <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
              </div>
              <div className="p-4 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
                    <div className="h-6 bg-gray-200 rounded w-24 animate-pulse" />
                    <div className="h-6 bg-gray-200 rounded w-16 animate-pulse" />
                    <div className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
                    <div className="h-6 bg-gray-200 rounded w-24 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 shadow-sm rounded-xl p-6"
              >
                <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse" />
                <div className="space-y-3">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="flex items-center justify-between">
                      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
