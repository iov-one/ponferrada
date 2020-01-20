import { Typography } from "medulas-react-components";
import * as React from "react";

interface MsgProps {
  readonly username: string;
}

const Msg = ({ username }: MsgProps): JSX.Element => {
  return (
    <React.Fragment>
      <Typography variant="body2" weight="semibold" inline>
        {username}
      </Typography>
      <Typography variant="body2" inline>
        {" "}
        personalized address targets have been updated
      </Typography>
    </React.Fragment>
  );
};

export default Msg;
