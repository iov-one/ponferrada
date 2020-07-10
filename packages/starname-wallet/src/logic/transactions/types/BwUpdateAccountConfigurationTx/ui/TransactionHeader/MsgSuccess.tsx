import { Typography } from "medulas-react-components";
import * as React from "react";

interface MsgProps {
  readonly name: string;
  readonly domain: string;
}

const Msg = ({ name, domain }: MsgProps): React.ReactElement => {
  return (
    <React.Fragment>
      <Typography variant="body2" weight="semibold" inline>
        {name}*{domain}
      </Typography>
      <Typography variant="body2" inline>
        {" "}
        account configuration has been updated
      </Typography>
    </React.Fragment>
  );
};

export default Msg;
