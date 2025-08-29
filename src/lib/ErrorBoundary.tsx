import React, { Component, type ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    console.error('Error captured in ErrorBoundary:', error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Card className="max-w-md w-full shadow-lg border">
            <CardContent className="text-center space-y-4 p-6">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
              <h2 className="text-2xl font-bold text-red-600">Lỗi hệ thống</h2>
              <p className="text-muted-foreground">
                Đã xảy ra lỗi trong hệ thống. Vui lòng thử lại sau hoặc tải lại
                trang.
              </p>
              <Button onClick={this.handleRetry} variant="destructive">
                Tải lại trang
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
