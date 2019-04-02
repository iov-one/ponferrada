import * as React from 'react';
import Block from '../Block';
import Typography from '../Typography';
import Image from '../Image';
import iovLogo from '../../theme/assets/iov-logo.png';

interface Props {
  readonly id?: string;
  readonly children: React.ReactNode;
  readonly primaryTitle: string;
  readonly title: string;
}

const PageLayout = ({
  id,
  children,
  title,
  primaryTitle,
}: Props): JSX.Element => {
  return (
    <Block
      display="flex"
      flexDirection="column"
      id={id}
      paddingRight={4}
      paddingLeft={4}
      paddingTop={2}
      height="100%"
    >
      <Block>
        <Typography color="primary" variant="h4" inline>
          {primaryTitle}
        </Typography>
        <Typography variant="h4" inline>
          {' '}
          {title}
        </Typography>
      </Block>
      <Block marginTop={3} marginBottom={1}>
        {children}
      </Block>
      <Block
        display="flex"
        flexDirection="column"
        flexGrow={1}
        alignItems="center"
        justifyContent="flex-end"
        marginBottom={2}
      >
        <Image src={iovLogo} alt="IOV logo" width={84} height={39} />
      </Block>
    </Block>
  );
};

export default PageLayout;
