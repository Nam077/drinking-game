const LoadingCard = () => {
  return (
    <div className="w-64 h-96 relative">
      <div className="absolute inset-0 card-shadow rounded-lg bg-white overflow-hidden">
        <div className="h-full flex flex-col items-center justify-center p-4">
          <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingCard; 