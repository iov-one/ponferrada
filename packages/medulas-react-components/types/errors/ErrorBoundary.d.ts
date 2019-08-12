import React from "react";
interface Props {
  readonly type: "inner" | "outer";
}
interface State {
  readonly openSentry: boolean;
}
export default class ErrorBoundary extends React.Component<Props, State> {
  readonly state: {
    openSentry: boolean;
  };
  readonly componentDidCatch: (error: Error | null, errorInfo: any) => void;
  render(): React.ReactNode;
}
export {};
