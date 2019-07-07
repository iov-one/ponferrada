import Block from 'medulas-react-components/lib/components/Block';
import Img from 'medulas-react-components/lib/components/Image';
import Typography from 'medulas-react-components/lib/components/Typography';
import React from 'react';
import deleteIcon from '../../../../assets/delete.svg';

interface Props {
  readonly expiryDate: Date;
}

const StatusPending = (props: Props): JSX.Element => {
  return (
    <React.Fragment>
      <Block display="flex" alignItems="center" marginBottom={1}>
        <Typography variant="body1" weight="semibold">
          Expires on {props.expiryDate.toLocaleDateString('es-ES')}
        </Typography>
        <Block marginLeft={2}>
          <Block display="flex" alignItems="center">
            <Img src={deleteIcon} alt="Delete Icon" height="16px" />
            <Typography variant="body1" weight="semibold">
              Delete
            </Typography>
          </Block>
        </Block>
      </Block>
      <Block padding={1} bgcolor="#d8d8d8" borderRadius="16px">
        <Typography variant="body1">
          This poll results will be available until {props.expiryDate.toLocaleDateString('es-ES')}
        </Typography>
      </Block>
    </React.Fragment>
  );
};

export default StatusPending;
