const SkeletonLoader = ({ count = 1, type = 'card', className = '' }) => {
  const skeletonTypes = {
    card: (
      <div className="bg-surface-100 rounded-xl p-6 shadow-sm border border-surface-200">
        <div className="animate-pulse">
          <div className="h-4 bg-surface-300 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-surface-300 rounded w-full"></div>
            <div className="h-3 bg-surface-300 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    ),
    list: (
      <div className="bg-white rounded-lg p-4 border border-surface-200">
        <div className="animate-pulse flex items-start gap-4">
          <div className="w-10 h-10 bg-surface-300 rounded-lg"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-surface-300 rounded w-2/3"></div>
            <div className="h-3 bg-surface-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    ),
    table: (
      <div className="bg-white rounded-lg border border-surface-200 overflow-hidden">
        <div className="animate-pulse">
          <div className="h-12 bg-surface-200 border-b border-surface-200"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 border-b border-surface-200 px-6 flex items-center space-x-4">
              <div className="h-4 bg-surface-300 rounded w-1/4"></div>
              <div className="h-4 bg-surface-300 rounded w-1/4"></div>
              <div className="h-4 bg-surface-300 rounded w-1/4"></div>
              <div className="h-4 bg-surface-300 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, index) => (
        <div key={index}>
          {skeletonTypes[type]}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;