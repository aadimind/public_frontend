import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (typeof console !== "undefined") {
      console.error("Micromath render error:", error, info.componentStack);
    }
  }

  handleTryAgain = () => {
    this.setState({ hasError: false });
  };

  handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        role="alert"
        className="container flex min-h-[60vh] max-w-2xl flex-col items-center justify-center py-16 text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Unexpected application error
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-fg">
          This page could not be rendered
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-fg-muted">
          An unexpected error interrupted the interface. You can try again without reloading
          the entire page.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={this.handleTryAgain}
            className="rounded-md bg-fg px-4 py-2 text-sm font-medium text-fg-inverse focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-offset-2"
          >
            Try again
          </button>
          <button
            type="button"
            onClick={this.handleReload}
            className="rounded-md border border-border-strong bg-transparent px-4 py-2 text-sm font-medium text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-offset-2"
          >
            Reload page
          </button>
        </div>
      </div>
    );
  }
}