import { Typography } from "medulas-react-components";
import * as React from "react";

interface MsgProps {
  readonly name?: string;
  readonly domain: string;
}

const Msg = ({ name, domain }: MsgProps): JSX.Element => {
  return (
    <React.Fragment>
      <Typography variant="body2" weight="semibold" inline>
        {name ? name : ""}*{domain}
      </Typography>
      <Typography variant="body2" inline>
        {" "}
        account targets have been updated
      </Typography>
    </React.Fragment>
  );
};

export default Msg;
