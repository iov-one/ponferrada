import * as React from "react";
interface Props extends StyleProps {
  readonly id?: string;
  readonly children: React.ReactNode;
  readonly primaryTitle: string;
  readonly title: string;
  readonly onBack?: () => void;
}
interface StyleProps {
  readonly color?: "white" | "transparent";
  readonly minHeight?: string | number;
}
declare const PageLayout: ({
  id,
  children,
  title,
  primaryTitle,
  onBack,
  color,
  minHeight,
}: Props) => JSX.Element;
export default PageLayout;
