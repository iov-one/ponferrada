import { VoteOption } from "@iov/bns";
import Button from "@material-ui/core/Button";
import { Block } from "medulas-react-components";
import React from "react";

interface Props {
  readonly vote: VoteOption | undefined;
}

const Buttons = ({ vote }: Props): JSX.Element => {
  const yesButton = vote === VoteOption.Yes ? "contained" : "outlined";
  const noButton = vote === VoteOption.No ? "contained" : "outlined";
  const abstainButton = vote === VoteOption.Abstain ? "contained" : "outlined";

  return (
    <Block margin={2}>
      <Block marginTop={0.5} marginBottom={0.5}>
        <Button fullWidth variant={yesButton}>
          Yes
        </Button>
      </Block>
      <Block marginTop={0.5} marginBottom={0.5}>
        <Button fullWidth variant={noButton}>
          No
        </Button>
      </Block>
      <Block marginTop={0.5} marginBottom={0.5}>
        <Button fullWidth variant={abstainButton}>
          Abstain
        </Button>
      </Block>
    </Block>
  );
};

export default Buttons;
