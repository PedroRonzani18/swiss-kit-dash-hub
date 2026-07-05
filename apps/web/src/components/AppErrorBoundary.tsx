import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import i18n from '@/shared/i18n';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled UI error', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md text-center space-y-4">
            <h1 className="text-xl font-semibold">
              {i18n.t('errorBoundary.title')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {i18n.t('errorBoundary.description')}
            </p>
            <Button onClick={this.handleReset}>
              {i18n.t('errorBoundary.reload')}
            </Button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
