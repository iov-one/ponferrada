import { Theme } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/styles';
import Block from 'medulas-react-components/lib/components/Block';
import ErrorBoundary from 'medulas-react-components/lib/errors/ErrorBoundary';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import Header from '../Header';

interface Props extends RouteComponentProps {
  readonly renderProps?: () => React.ReactNode;
  readonly children?: React.ReactNode;
  readonly padding?: boolean;
}

const PageMenu = ({ children, padding = true, renderProps, location }: Props): JSX.Element => {
  const theme = useTheme<Theme>();

  return (
    <Block display="flex" flexDirection="column" bgcolor={theme.palette.background.default}>
      <Header path={location.pathname} />
      <ErrorBoundary type="inner">
        <Block display="flex" flexDirection="column" padding={padding ? 4 : undefined}>
          {renderProps !== undefined ? renderProps() : children}
        </Block>
      </ErrorBoundary>
    </Block>
  );
};

export default withRouter(PageMenu);
