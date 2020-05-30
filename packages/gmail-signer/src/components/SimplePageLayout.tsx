import { Block } from "medulas-react-components";
import * as React from "react";

export const defaultPageHeight = 500;

interface Props {
  readonly id?: string;
  readonly children: React.ReactNode;
  readonly height?: string | number;
}

const SimplePageLayout = ({ id, children, height }: Props): JSX.Element => {
  return (
    <Block
      id={id}
      height={height || defaultPageHeight}
      display="flex"
      flexDirection="column"
      bgcolor="#f5f7f9"
      overflow="auto"
    >
      {children}
    </Block>
  );
};

export default SimplePageLayout;
