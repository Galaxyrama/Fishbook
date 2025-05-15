import React from "react";

const UserPageSkeleton = () => {
  return (
    <div className="flex w-full justify-center pt-25 sm:px-16">
      <div className="block w-full max-w-3xl justify-center animate-pulse">
        <div className="block sm:flex w-full">
          <div className="flex justify-center">
            <div className="w-40 flex-shrink-0">
              <div className="w-40 h-40 rounded-full bg-gray-700" />
            </div>
          </div>

          <div className="block w-full text-center sm:ml-5 px-3">
            <div className="sm:px-10 py-5 flex justify-evenly text-xl sm:text-2xl sm:gap-10">
              <div className="block">
                <div className="w-10 h-6 bg-gray-700 rounded mb-2 mx-auto" />
                <div className="w-16 h-4 bg-gray-700 rounded mx-auto" />
              </div>
              <div className="block">
                <div className="w-10 h-6 bg-gray-700 rounded mb-2 mx-auto" />
                <div className="w-16 h-4 bg-gray-700 rounded mx-auto" />
              </div>
              <div className="block">
                <div className="w-10 h-6 bg-gray-700 rounded mb-2 mx-auto" />
                <div className="w-16 h-4 bg-gray-700 rounded mx-auto" />
              </div>
            </div>

            <div className="w-full h-10 bg-gray-700 rounded-xl mt-4" />
          </div>
        </div>

        <div className="text-center mt-3 sm:mt-5 sm:text-left">
          <div className="w-2/3 h-10 bg-gray-700 rounded mx-auto sm:mx-0 mb-2" />
          <div className="w-full h-6 bg-gray-700 rounded mb-1 sm:mx-0" />
          <div className="w-3/4 h-6 bg-gray-700 rounded sm:mx-0" />
        </div>
      </div>
    </div>
  );
};

export default UserPageSkeleton;
