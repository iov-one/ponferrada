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
    <Block id={id} paddingRight={2} paddingLeft={2} paddingTop={2}>
      <Typography color="primary" variant="h4" inline>
        {primaryTitle}
      </Typography>
      <Typography variant="h4" inline>
        {' '}
        {title}
      </Typography>
      <Block padding={2} marginTop={3} marginBottom={1}>
        {children}
      </Block>
      <Block textAlign="center" marginBottom={1}>
        <Image src={iovLogo} alt="IOV logo" />
      </Block>
    </Block>
  );
};

export default PageLayout;
