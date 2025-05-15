import React from "react";

const PostSkeleton = ({ revealParts }) => {
  return (
    <div
      className={`flex justify-center px-2 ${
        revealParts ? "pt-20 pb-10" : "pt-0 pb-5"
      }`}
    >
      <div className="block px-5 max-w-3xl w-full bg-white/5 rounded-xl drop-shadow-xl animate-pulse space-y-4 bg-white">
        {/* Header with Profile */}
        <div className="flex items-center justify-between py-4">
          <div className="flex gap-3 items-center">
            <div className="w-12 h-12 rounded-full bg-gray-700" />
            <div className="h-4 w-32 bg-gray-700 rounded" />
          </div>
          <div className="w-6 h-6 bg-gray-700 rounded" />
        </div>

        {/* Post Title */}
        <div className="h-4 bg-gray-700 rounded w-5/6" />
        <div className="h-4 bg-gray-700 rounded w-4/6" />

        {/* Image / Video Placeholder */}
        <div className="w-full h-64 bg-gray-700 rounded-md" />

        {/* Upload Date */}
        <div className="h-3 w-24 bg-gray-600 rounded" />

        <hr className="border-gray-800" />

        {/* Buttons: Comment, Like, Share */}
        <div className="flex justify-between mr-10 ml-15 py-2">
          <div className="flex gap-2">
            <div className="w-6 h-6 bg-gray-700 rounded" />
            <div className="w-6 h-4 bg-gray-600 rounded" />
          </div>
          <div className="flex gap-2">
            <div className="w-6 h-6 bg-gray-700 rounded" />
            <div className="w-6 h-4 bg-gray-600 rounded" />
          </div>
          <div className="w-6 h-6 bg-gray-700 rounded" />
        </div>

        <hr className="border-gray-800" />

        {/* Reply Box */}
        <div className="h-10 bg-gray-700 rounded-md" />

        {/* Comment Skeletons */}
        {revealParts && (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-10 h-10 bg-gray-700 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="w-1/2 h-3 bg-gray-600 rounded" />
                  <div className="w-3/4 h-3 bg-gray-600 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        <hr className="pb-2 border-gray-800" />
      </div>
    </div>
  );
};

export default PostSkeleton;
