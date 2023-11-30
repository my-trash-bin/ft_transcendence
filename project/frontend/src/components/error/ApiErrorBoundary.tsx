import { Component, ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

class ApiErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log('에러가 발생했습니다.');
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (typeof window !== 'undefined') {
        // window.location.href = '/';
      }
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}

function ErrorFallback() {
  // 에러 페이지
  return <div>Something went wrong.</div>;
}

export default ApiErrorBoundary;
