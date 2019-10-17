import { Block, Typography } from "medulas-react-components";
import React, { ReactNode } from "react";

interface Props {
  readonly children: ReactNode;
  readonly toggleExpanded: () => void;
}

const ReadMore = ({ children, toggleExpanded }: Props): JSX.Element => {
  return (
    <Block marginTop={2}>
      {children}
      <Typography inline link onClick={toggleExpanded} variant="body2" weight="semibold">
        Read more
      </Typography>
    </Block>
  );
};

export default ReadMore;
