import { Typography } from "medulas-react-components";
import * as React from "react";

interface MsgProps {
  readonly domain: string;
}

const Msg = ({ domain }: MsgProps): React.ReactElement => {
  return (
    <React.Fragment>
      <Typography variant="body2" weight="semibold" inline>
        *{domain}
      </Typography>
      <Typography variant="body2" inline>
        {" "}
        fees have been updated
      </Typography>
    </React.Fragment>
  );
};

export default Msg;
