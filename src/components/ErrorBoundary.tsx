import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = "Something went wrong. Please try again later.";
      
      try {
        if (this.state.error?.message) {
          const parsedError = JSON.parse(this.state.error.message);
          if (parsedError.error && parsedError.error.includes('Missing or insufficient permissions')) {
            errorMessage = "You don't have permission to perform this action. Please check your account or contact support.";
          }
        }
      } catch (e) {
        // Not a JSON error, use default
      }

      return (
        <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white p-8 rounded-[32px] border border-stone-100 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-serif font-medium text-stone-900">Application Error</h2>
              <p className="text-stone-500">{errorMessage}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-stone-900 text-white rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-stone-800 transition-all"
            >
              <RefreshCcw className="w-5 h-5" />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
