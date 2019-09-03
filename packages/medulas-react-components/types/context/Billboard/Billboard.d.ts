import React from "react";
interface Props {
  readonly show: boolean;
  readonly message: React.ReactNode;
  readonly children: React.ReactNode;
}
declare function Billboard({ show, children, message }: Props): JSX.Element;
export default Billboard;
