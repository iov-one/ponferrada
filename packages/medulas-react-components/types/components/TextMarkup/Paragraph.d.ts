import * as React from "react";
interface Props {
  readonly children: React.ReactNode;
  readonly inline?: boolean;
  readonly strong?: boolean;
}
declare const SectionParagraph: ({ children, inline, strong }: Props) => JSX.Element;
export default SectionParagraph;
