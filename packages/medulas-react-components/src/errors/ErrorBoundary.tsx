import * as Sentry from '@sentry/browser';
import React from 'react';

interface Props {
  readonly type: 'inner' | 'outer';
}

interface State {
  readonly openSentry: boolean;
}

//Not possible to convert this component to hooks because of https://reactjs.org/docs/hooks-faq.html#do-hooks-cover-all-use-cases-for-classes
export default class ErrorBoundary extends React.Component<Props, State> {
  public readonly state = {
    openSentry: false,
  };

  public readonly componentDidCatch = (error: Error | null, errorInfo: any): void => {
    const openSentry = process.env.NODE_ENV === 'production' ? true : false;
    this.setState({ openSentry });

    Sentry.withScope(scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key]);
      });
      Sentry.captureException(error);
    });
  };

  public render(): React.ReactNode {
    return this.state.openSentry ? (
      <React.Fragment>{Sentry.showReportDialog() as React.ReactNode}</React.Fragment>
    ) : (
      this.props.children
    );
  }
}
