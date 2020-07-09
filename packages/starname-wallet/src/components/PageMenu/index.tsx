import { Theme } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/styles";
import { Block } from "medulas-react-components";
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";

import Header from "../Header";

export interface PageMenuProps {
  readonly children?: React.ReactNode;
  readonly padding?: boolean;
}

const PageMenu = ({
  children,
  padding = true,
  location,
}: RouteComponentProps & PageMenuProps): React.ReactElement => {
  const theme = useTheme<Theme>();

  return (
    <Block display="flex" flexDirection="column" bgcolor={theme.palette.background.default}>
      <Header path={location.pathname} />
      <Block display="flex" flexDirection="column" padding={padding ? 4 : undefined}>
        {children}
      </Block>
    </Block>
  );
};

export default withRouter(PageMenu);
