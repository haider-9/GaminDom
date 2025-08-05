import { ChevronRight } from "lucide-react";

interface RecentGameSkeletonProps {
  count?: number;
}

const RecentGameSkeleton = ({ count = 3 }: RecentGameSkeletonProps) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, i) => i + 1).map((i) => (
        <div
          key={i}
          className="flex items-center bg-black/50 p-3 rounded-3xl w-full lg:w-96 justify-between gap-4 animate-pulse"
        >
          <div className="rounded-lg size-16 bg-gray-600"></div>
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-4 bg-gray-600 rounded w-3/4"></div>
            <div className="h-3 bg-gray-600 rounded w-full"></div>
          </div>
          <ChevronRight size={20} className="text-gray-600" />
        </div>
      ))}
    </div>
  );
};

export default RecentGameSkeleton;