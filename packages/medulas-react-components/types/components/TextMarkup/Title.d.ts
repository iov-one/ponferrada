import * as React from "react";
interface Props {
  readonly children: React.ReactNode;
  readonly variant?: "h5" | "h6";
}
declare const TitleComponent: ({ children, variant }: Props) => JSX.Element;
export default TitleComponent;
