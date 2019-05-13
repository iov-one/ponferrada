import * as React from 'react';
import Block from '../Block';
import Typography from '../Typography';
import Image from '../Image';
import iovLogo from '../../theme/assets/iov-logo.png';
import ArrowBackIcon from '@material-ui/icons/ArrowBackIos';

interface Props {
  readonly id?: string;
  readonly children: React.ReactNode;
  readonly primaryTitle: string;
  readonly title: string;
  readonly onBack?: () => void;
}

const PageLayout = ({ id, children, title, primaryTitle, onBack }: Props): JSX.Element => {
  const showBackArrow = !!onBack;

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
      {showBackArrow && (
        <Block marginLeft={-2}>
          <Typography link>
            <ArrowBackIcon fontSize="large" onClick={onBack} />
          </Typography>
        </Block>
      )}
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
      <Block flexGrow={1} />
      <Block marginBottom={2} marginTop={2} justifyContent="flex-end" textAlign="center">
        <Image src={iovLogo} alt="IOV logo" width={84} height={39} />
      </Block>
    </Block>
  );
};

export default PageLayout;
