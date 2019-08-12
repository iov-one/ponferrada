import * as React from "react";
interface Props {
  readonly injectFonts?: boolean;
  readonly injectStyles?: (props?: any) => void;
  readonly children: React.ReactNode;
}
declare const MedulasThemeProvider: ({ injectFonts, injectStyles, children }: Props) => JSX.Element;
export default MedulasThemeProvider;
