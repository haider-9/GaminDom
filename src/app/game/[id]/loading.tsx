export default function Loading() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 bg-gray-700 rounded w-32"></div>
            <div className="flex gap-2">
              <div className="h-10 w-10 bg-gray-700 rounded-lg"></div>
              <div className="h-10 w-10 bg-gray-700 rounded-lg"></div>
            </div>
          </div>
          
          {/* Hero skeleton */}
          <div className="h-96 bg-gray-700 rounded-2xl mb-8"></div>
          
          {/* Content skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-800/50 rounded-xl p-6">
                <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-700 rounded w-4/6"></div>
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-xl p-6">
                <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="h-64 bg-gray-700 rounded-lg"></div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-xl p-6">
                <div className="h-6 bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-xl p-6">
                <div className="h-6 bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-10 bg-gray-700 rounded-lg"></div>
                  <div className="h-10 bg-gray-700 rounded-lg"></div>
                  <div className="h-10 bg-gray-700 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}