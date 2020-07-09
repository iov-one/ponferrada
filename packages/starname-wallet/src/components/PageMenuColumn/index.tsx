import { Block } from "medulas-react-components";
import * as React from "react";

import PageMenu, { PageMenuProps } from "../PageMenu";

interface Props extends PageMenuProps {
  readonly children: React.ReactNode;
  readonly maxWidth?: number;
}

const PageMenuColumn = ({ children, maxWidth = 650, ...props }: Props): JSX.Element => {
  return (
    <PageMenu {...props}>
      <Block display="flex" margin={2}>
        <Block flexGrow={1} />
        <Block maxWidth={maxWidth} display="flex" alignItems="center" width="100%" flexDirection="column">
          {children}
        </Block>
        <Block flexGrow={1} />
      </Block>
    </PageMenu>
  );
};

export default PageMenuColumn;
