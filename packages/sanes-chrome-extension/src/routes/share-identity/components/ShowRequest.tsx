import Block from 'medulas-react-components/lib/components/Block';
import Button from 'medulas-react-components/lib/components/Button';
import Hairline from 'medulas-react-components/lib/components/Hairline';
import { List, ListItem, ListItemText } from 'medulas-react-components/lib/components/List';
import PageLayout from 'medulas-react-components/lib/components/PageLayout';
import Typography from 'medulas-react-components/lib/components/Typography';
import * as React from 'react';

import { UiIdentity } from '../../../extension/background/model/signingServer/requestQueueManager';
import { SHARE_IDENTITY } from '../../paths';

export const SHARE_IDENTITY_SHOW = `${SHARE_IDENTITY}_show`;

interface Props {
  readonly onAcceptRequest: () => void;
  readonly showRejectView: () => void;
  readonly sender: string;
  readonly data: ReadonlyArray<UiIdentity>;
}

const Layout = ({ sender, data, onAcceptRequest, showRejectView }: Props): JSX.Element => (
  <PageLayout id={SHARE_IDENTITY_SHOW} color="white" primaryTitle="Share" title="Identity">
    <Block textAlign="center" marginBottom={2}>
      <Typography variant="body1">The following site:</Typography>
      <Typography variant="body1" color="primary">
        {sender}
      </Typography>
      <Typography variant="body1" inline>
        wants to have access to:
      </Typography>
    </Block>
    <List>
      {data.map((identity: UiIdentity, index: number) => {
        const secondaryProps = {
          noWrap: true,
        };

        return (
          <React.Fragment key={`${index}`}>
            <ListItem>
              <ListItemText
                primary={identity.chainName}
                secondary={identity.address}
                secondaryTypographyProps={secondaryProps}
              />
            </ListItem>
            <Hairline />
          </React.Fragment>
        );
      })}
    </List>
    <Block marginTop={2} />
    <Button variant="contained" fullWidth onClick={onAcceptRequest}>
      Accept
    </Button>
    <Block marginTop={2} />
    <Button variant="contained" fullWidth color="secondary" onClick={showRejectView}>
      Reject
    </Button>
  </PageLayout>
);

export default Layout;
