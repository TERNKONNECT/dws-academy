import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Without this, one page throwing during render unmounts the whole app and the
 * visitor gets a blank white screen with nothing to act on. A broken page should
 * degrade to a message and a way out.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled render error:", error, info.componentStack);
  }

  private handleReset = () => {
    this.setState({ error: null });
    window.location.href = "/";
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0B0C] px-4">
        <div className="max-w-md w-full space-y-6 text-center">
          <h1 className="text-2xl font-bold text-white">
            This page didn't load
          </h1>
          <p className="text-white/70">
            Something went wrong while rendering it. The rest of the site is
            still working.
          </p>
          {import.meta.env.DEV && (
            <pre className="text-left text-xs text-red-300 bg-black/40 border border-white/10 rounded p-3 overflow-x-auto">
              {this.state.error.message}
            </pre>
          )}
          <div className="flex gap-3 justify-center">
            <Button onClick={() => window.location.reload()} variant="outline">
              Reload
            </Button>
            <Button onClick={this.handleReset}>Go to homepage</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
