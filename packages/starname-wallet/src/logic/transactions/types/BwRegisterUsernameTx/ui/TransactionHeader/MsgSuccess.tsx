import { Typography } from "medulas-react-components";
import * as React from "react";

interface MsgProps {
  readonly username: string;
}

const Msg = ({ username }: MsgProps): React.ReactElement => {
  return (
    <React.Fragment>
      <Typography variant="body2" weight="semibold" inline>
        {username}
      </Typography>
      <Typography variant="body2" inline>
        {" "}
        personalized address has been registered
      </Typography>
    </React.Fragment>
  );
};

export default Msg;
