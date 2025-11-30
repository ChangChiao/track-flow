export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* 標題骨架 */}
      <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
      
      {/* 控制列骨架 */}
      <div className="bg-white rounded-lg shadow mb-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="h-8 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
        
        {/* 時間軸骨架 */}
        <div className="flex border-b border-gray-200">
          <div className="w-64 h-12 bg-gray-100 border-r border-gray-200"></div>
          <div className="flex-1 flex">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 border-r border-gray-200" style={{ width: '120px' }}></div>
            ))}
          </div>
        </div>
        
        {/* 專案列骨架 */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex border-b border-gray-200">
            <div className="w-64 px-4 py-3 border-r border-gray-200">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
            <div className="flex-1 px-2 py-3">
              <div className="h-6 bg-gray-200 rounded w-1/3" style={{ marginTop: '8px' }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}