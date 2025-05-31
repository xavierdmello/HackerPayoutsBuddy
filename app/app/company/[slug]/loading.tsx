export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl p-6">
                <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-32 mb-6"></div>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-4">
                      <div className="h-6 bg-gray-200 rounded w-6 mx-auto mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-12 mx-auto mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-16 mx-auto"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6">
                  <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
