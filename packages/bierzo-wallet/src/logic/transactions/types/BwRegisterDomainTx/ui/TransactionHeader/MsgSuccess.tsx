import { Typography } from "medulas-react-components";
import * as React from "react";

interface MsgProps {
  readonly domain: string;
}

const Msg = ({ domain }: MsgProps): JSX.Element => {
  return (
    <React.Fragment>
      <Typography variant="body2" weight="semibold" inline>
        *{domain}
      </Typography>
      <Typography variant="body2" inline>
        {" "}
        starname has been registered
      </Typography>
    </React.Fragment>
  );
};

export default Msg;
