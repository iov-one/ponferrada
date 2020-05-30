import { makeStyles, Theme } from "@material-ui/core";
import { TypographyProps } from "@material-ui/core/Typography";
import CompareArrows from "@material-ui/icons/CompareArrows";
import {
  Avatar,
  Block,
  Hairline,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "medulas-react-components";
import * as React from "react";

import { RequestContext } from "../../../../../../../context/RequestProvider";
import {
  isGetIdentitiesRequest,
  Request,
} from "../../../../../../../extension/background/model/requestsHandler/requestQueueManager";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    border: "none",
  },
  avatar: {
    height: "35px",
    width: "35px",
    backgroundColor: theme.palette.primary.main,
  },
  first: {
    cursor: "pointer",
  },
}));

export const REQUEST_FIELD = "req";

interface Props {
  readonly setShowRequest: React.Dispatch<React.SetStateAction<boolean>>;
}

const RequestList = ({ setShowRequest }: Props): JSX.Element => {
  const classes = useStyles();
  const secondaryProps: TypographyProps = {
    color: "textPrimary",
  };

  const requestContext = React.useContext(RequestContext);
  const { requests } = requestContext;
  const hasRequests = requests.length > 0;

  if (!hasRequests)
    return (
      <Typography align="center" weight="semibold">
        No requests in queue
      </Typography>
    );

  return (
    <React.Fragment>
      <Block marginBottom={3}>
        <Typography variant="subtitle2" color="textPrimary">
          Remember! Transactions should be resolved in order!
        </Typography>
      </Block>
      <List className={classes.root}>
        {requests.map((req: Request, index: number) => {
          const first = index === 0;
          const firstElemClass = first ? classes.first : undefined;
          const onRequestClick = (): void => setShowRequest(true);
          const text = isGetIdentitiesRequest(req) ? "Get Identities Request" : "Sign Request";

          return (
            <React.Fragment key={`${index}`}>
              <ListItem
                className={firstElemClass}
                disabled={!first}
                onClick={first ? onRequestClick : undefined}
              >
                <ListItemText
                  primary={text}
                  secondary={req.reason}
                  secondaryTypographyProps={secondaryProps}
                />
                {first && (
                  <ListItemAvatar>
                    <Avatar color="primary" className={classes.avatar}>
                      <CompareArrows />
                    </Avatar>
                  </ListItemAvatar>
                )}
              </ListItem>
              {first && <Hairline />}
            </React.Fragment>
          );
        })}
      </List>
    </React.Fragment>
  );
};

export default RequestList;
