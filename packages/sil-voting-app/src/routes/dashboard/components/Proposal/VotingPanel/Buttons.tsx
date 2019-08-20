import { VoteOption } from "@iov/bns";
import Button from "@material-ui/core/Button";
import { Block, Form, useForm } from "medulas-react-components";
import React, { useState } from "react";
import * as ReactRedux from "react-redux";

import { sendSignAndPostRequest } from "../../../../../communication/signandpost";
import { getBnsConnection } from "../../../../../logic/connection";
import { RootState } from "../../../../../store/reducers";

interface Props {
  readonly id: number;
  readonly vote: VoteOption | undefined;
}

const Buttons = ({ id, vote }: Props): JSX.Element => {
  const [currentVote, setCurrentVote] = useState(vote);
  const governor = ReactRedux.useSelector((state: RootState) => state.extension.governor);

  const yesButton = currentVote === VoteOption.Yes ? "contained" : "outlined";
  const noButton = currentVote === VoteOption.No ? "contained" : "outlined";
  const abstainButton = currentVote === VoteOption.Abstain ? "contained" : "outlined";

  const voteYes = (): void => setCurrentVote(VoteOption.Yes);
  const voteNo = (): void => setCurrentVote(VoteOption.No);
  const voteAbstain = (): void => setCurrentVote(VoteOption.Abstain);

  const submitVote = async (): Promise<void> => {
    if (!governor) throw new Error("Governor not set in store. This is a bug.");

    if (currentVote !== undefined) {
      const connection = await getBnsConnection();
      const voteTx = await governor.buildVoteTx(id, currentVote);
      await sendSignAndPostRequest(connection, voteTx);
    }
  };

  const { handleSubmit, submitting } = useForm({ onSubmit: submitVote });

  return (
    <Block margin={2}>
      <Form onSubmit={handleSubmit}>
        <Block marginTop={0.5} marginBottom={0.5}>
          <Button fullWidth variant={yesButton} onClick={voteYes} type="submit" disabled={submitting}>
            Yes
          </Button>
        </Block>
        <Block marginTop={0.5} marginBottom={0.5}>
          <Button fullWidth variant={noButton} onClick={voteNo} type="submit" disabled={submitting}>
            No
          </Button>
        </Block>
        <Block marginTop={0.5} marginBottom={0.5}>
          <Button fullWidth variant={abstainButton} onClick={voteAbstain} type="submit" disabled={submitting}>
            Abstain
          </Button>
        </Block>
      </Form>
    </Block>
  );
};

export default Buttons;
