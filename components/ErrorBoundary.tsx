import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { tStatic } from '../utils/i18n';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.props = props;
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
          return this.props.fallback;
      }

      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-300 p-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md text-center shadow-2xl">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle size={32} className="text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">{tStatic('errorUnexpected')}</h2>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                  {tStatic('errorBody')}
              </p>

              <div className="bg-black/50 rounded p-4 mb-6 text-left overflow-auto max-h-32 border border-zinc-800">
                  <code className="text-xs font-mono text-red-400">
                      {this.state.error?.message || "Erro desconhecido"}
                  </code>
              </div>

              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 bg-white hover:bg-zinc-200 text-black font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} />
                {tStatic('reloadSystem')}
              </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
