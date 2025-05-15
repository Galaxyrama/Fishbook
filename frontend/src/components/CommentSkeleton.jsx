import React from "react";

const CommentSkeleton = () => {
  return (
    <div className="flex justify-center px-2 pt-20 pb-5 animate-pulse">
      <div className="block px-5 w-3xl pt-2 bg-white rounded-xl drop-shadow-xl space-y-4">
        {/* Post block skeleton */}
        <div className="flex py-2">
          <div className="w-12 h-12 rounded-full bg-gray-700 mr-3" />
          <div className="flex-1 space-y-2">
            <div className="w-1/3 h-5 bg-gray-700 rounded" />
            <div className="w-1/4 h-4 bg-gray-700 rounded" />
            <div className="w-full h-4 bg-gray-700 rounded" />
            <div className="w-full h-40 bg-gray-700 rounded" />
            <div className="flex justify-between px-5 mt-2">
              <div className="w-16 h-6 bg-gray-700 rounded" />
              <div className="w-16 h-6 bg-gray-700 rounded" />
              <div className="w-16 h-6 bg-gray-700 rounded" />
            </div>
          </div>
        </div>

        {/* Current comment skeleton */}
        <div className="flex py-2">
          <div className="w-12 h-12 rounded-full bg-gray-700 mr-3" />
          <div className="flex-1 space-y-2">
            <div className="w-1/3 h-5 bg-gray-700 rounded" />
            <div className="w-full h-4 bg-gray-700 rounded" />
            <div className="w-full h-36 bg-gray-700 rounded" />
            <div className="flex justify-between px-5 mt-2">
              <div className="w-16 h-6 bg-gray-700 rounded" />
              <div className="w-16 h-6 bg-gray-700 rounded" />
              <div className="w-16 h-6 bg-gray-700 rounded" />
            </div>
          </div>
        </div>

        {/* Input skeleton */}
        <div className="w-full h-10 bg-gray-700 rounded" />

        {/* Comment list skeleton */}
        {[...Array(2)].map((_, idx) => (
          <div key={idx} className="flex space-x-3">
            <div className="w-10 h-10 bg-gray-700 rounded-full" />
            <div className="flex-1 space-y-2 py-2">
              <div className="w-1/4 h-4 bg-gray-700 rounded" />
              <div className="w-3/4 h-4 bg-gray-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSkeleton;
