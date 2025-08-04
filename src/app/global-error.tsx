"use client";
import React from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const GlobalError = ({ error, reset }: GlobalErrorProps) => {
  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <html>
      <body className="font-Orbitron">
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-black to-gray-900">
          <div className="max-w-lg w-full">
            <div className="bg-black/50 rounded-3xl p-8 text-center backdrop-blur-sm border border-white/10">
              {/* Error Icon */}
              <div className="w-24 h-24 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle size={48} className="text-red-400" />
              </div>

              {/* Error Title */}
              <h1 className="text-3xl font-bold text-white mb-4">
                Critical Error
              </h1>

              {/* Error Message */}
              <p className="text-white/70 mb-6 leading-relaxed">
                Something went seriously wrong. The application encountered an unexpected error and needs to be restarted.
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
                  {error.stack && (
                    <details className="mt-2">
                      <summary className="text-white/70 text-xs cursor-pointer">
                        Stack Trace
                      </summary>
                      <pre className="text-white/50 text-xs mt-2 overflow-auto max-h-32">
                        {error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={reset}
                  className="w-full bg-[#bb3b3b] hover:bg-[#bb3b3b]/80 text-white px-6 py-3 rounded-3xl transition-colors flex items-center justify-center gap-2 font-semibold"
                >
                  <RefreshCw size={18} />
                  Restart Application
                </button>

                <button
                  onClick={handleGoHome}
                  className="w-full bg-black/30 hover:bg-black/50 text-white px-6 py-3 rounded-3xl transition-colors flex items-center justify-center gap-2"
                >
                  <Home size={18} />
                  Go to Homepage
                </button>
              </div>

              {/* Help Text */}
              <p className="text-white/50 text-sm mt-6">
                If this error persists, please refresh the page or contact support.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;