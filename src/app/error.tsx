"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Home, RefreshCw, ArrowLeft } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  const router = useRouter();

  const getErrorMessage = (error: Error) => {
    if (error.message.includes("fetch")) {
      return "Network connection failed. Please check your internet connection.";
    }
    if (error.message.includes("404")) {
      return "The requested resource could not be found.";
    }
    if (error.message.includes("500")) {
      return "Internal server error. Please try again later.";
    }
    return error.message || "An unexpected error occurred.";
  };

  const getErrorTitle = (error: Error) => {
    if (error.message.includes("fetch")) {
      return "Connection Error";
    }
    if (error.message.includes("404")) {
      return "Not Found";
    }
    if (error.message.includes("500")) {
      return "Server Error";
    }
    return "Something Went Wrong";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-black/50 rounded-3xl p-8 text-center">
          {/* Error Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
            <AlertTriangle size={40} className="text-red-400" />
          </div>

          {/* Error Title */}
          <h1 className="text-2xl font-bold text-white mb-4">
            {getErrorTitle(error)}
          </h1>

          {/* Error Message */}
          <p className="text-white/70 mb-6 leading-relaxed">
            {getErrorMessage(error)}
          </p>

          {/* Error Details (Development) */}
          {process.env.NODE_ENV === "development" && (
            <div className="bg-black/30 rounded-2xl p-4 mb-6 text-left">
              <p className="text-red-400 text-sm font-mono break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-white/50 text-xs mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={reset}
              className="w-full bg-[#bb3b3b] hover:bg-[#bb3b3b]/80 text-white px-6 py-3 rounded-3xl transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} />
              Try Again
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => router.back()}
                className="bg-black/30 hover:bg-black/50 text-white px-4 py-3 rounded-3xl transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} />
                Go Back
              </button>

              <button
                onClick={() => router.push("/")}
                className="bg-black/30 hover:bg-black/50 text-white px-4 py-3 rounded-3xl transition-colors flex items-center justify-center gap-2"
              >
                <Home size={16} />
                Home
              </button>
            </div>
          </div>

          {/* Help Text */}
          <p className="text-white/50 text-sm mt-6">
            If this problem persists, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;