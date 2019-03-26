import * as React from 'react';
import Button from 'medulas-react-components/lib/components/Button';
import Typography from 'medulas-react-components/lib/components/Typography';
import Block from 'medulas-react-components/lib/components/Block';
import Image from 'medulas-react-components/lib/components/Image';
import iovLogo from '../../../assets/iov-logo.png';
import { SIGNUP_ROUTE } from '../../paths';

const ShowPhrase = (): JSX.Element => {
  return (
    <Block
      id={`${SIGNUP_ROUTE}_second`}
      paddingRight={2}
      paddingLeft={2}
      paddingTop={2}
    >
      <Typography color="primary" variant="h4" inline>
        Recovery
      </Typography>
      <Typography variant="h4" inline>
        {' Phrase'}
      </Typography>
      <Block padding={2} marginTop={3} marginBottom={6}>
        <Block
          padding={2}
          border={1}
          borderColor="grey.300"
          borderRadius={5}
          bgcolor="grey.300"
        >
          <Typography variant="body1" inline>
            organ wheat manage mirror wish truly tool trumpet since equip flight
            bracket
          </Typography>
        </Block>
      </Block>
      <Block display="flex" justifyContent="flex-end">
        <Button type="submit">Create</Button>
      </Block>
      <Block textAlign="center" marginBottom={1}>
        <Image src={iovLogo} alt="IOV logo" />
      </Block>
    </Block>
  );
};

export default ShowPhrase;
