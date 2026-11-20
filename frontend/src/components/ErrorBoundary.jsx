import React from 'react';
import { RefreshCw, Home, AlertCircle } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto border border-orange-100">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h2 className="font-heading font-black text-xl text-slate-900">
              Something went wrong loading this view
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              We encountered a display issue. All tractor and car inventory data is safe.
            </p>
            {this.state.error && this.state.error.message && (
              <div className="text-[11px] font-mono text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-100 text-left overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.reload();
                }}
                className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reload View
              </button>
              <a
                href="/"
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
              >
                <Home className="w-3.5 h-3.5" />
                Return Home
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
