import React, { Component } from 'react';
import { AlertTriangleIcon } from 'lucide-react';
interface Props {
  children: React.ReactNode;
}
interface State {
  hasError: boolean;
  error: Error | null;
}
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };
  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }
  public render() {
    if (this.state.hasError) {
      return <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="flex justify-center">
              <AlertTriangleIcon className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="mt-6 text-center text-3xl font-bold text-gray-900">
              Something went wrong
            </h1>
            <p className="mt-2 text-center text-sm text-gray-600">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <div className="mt-6 flex justify-center">
              <button onClick={() => window.location.reload()} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Refresh Page
              </button>
            </div>
          </div>
        </div>;
    }
    return this.props.children;
  }
}