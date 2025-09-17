import React from 'react';
import error from '../images/error.png'; 

const NotFoundPage = () => {
  return (
    <div className=" flex items-center justify-center h-screen
      ">
      <div className="flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-16">
        {/* Text Section */}
        <div className="max-w-sm text-center md:text-left">
          <h1 className="text-5xl font-bold text-[#E9EAF0] mb-4">Error 404</h1>
          <h2 className="text-3xl font-semibold text-[#001744] mb-4">Oops! page not found</h2>
          <p className="text-[#4E5566] mb-6">
            Something went wrong. It looks like your requested page could not be found.
            The link may be broken or the page has been removed.
          </p>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>

        {/* Image Section */}
        <div className="w-full max-w-xl">
          <img src={error} alt="404 illustration" className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
