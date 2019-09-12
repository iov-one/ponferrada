import { VoteOption } from "@iov/bns";
import Button from "@material-ui/core/Button";
import { Block, Form, ToastContext, ToastVariant, useForm } from "medulas-react-components";
import React, { useState } from "react";
import * as ReactRedux from "react-redux";

import { communicationTexts } from "../../../../../communication";
import { sendSignAndPostRequest } from "../../../../../communication/signandpost";
import { getBnsConnection } from "../../../../../logic/connection";
import { getProposals, replaceProposalsAction } from "../../../../../store/proposals";
import { RootState } from "../../../../../store/reducers";
import { setTransactionsStateAction } from "../../../../../store/transactions";

interface Props {
  readonly id: number;
  readonly vote: VoteOption | undefined;
}

const Buttons = ({ id, vote }: Props): JSX.Element => {
  const toast = React.useContext(ToastContext);
  const [currentVote, setCurrentVote] = useState(vote);
  const previousVote = vote;

  const governor = ReactRedux.useSelector((state: RootState) => state.extension.governor);
  if (!governor) throw new Error("Governor not set in store. This is a bug.");
  const dispatch = ReactRedux.useDispatch();

  const yesButton = currentVote === VoteOption.Yes ? "contained" : "outlined";
  const noButton = currentVote === VoteOption.No ? "contained" : "outlined";
  const abstainButton = currentVote === VoteOption.Abstain ? "contained" : "outlined";

  const voteYes = (): void => setCurrentVote(VoteOption.Yes);
  const voteNo = (): void => setCurrentVote(VoteOption.No);
  const voteAbstain = (): void => setCurrentVote(VoteOption.Abstain);

  const submitVote = async (): Promise<void> => {
    if (currentVote === undefined || currentVote === previousVote) return;

    try {
      const connection = await getBnsConnection();
      const voteTx = await governor.buildVoteTx(id, currentVote);

      const transactionId = await sendSignAndPostRequest(connection, voteTx);
      if (transactionId === undefined) {
        toast.show(communicationTexts.notAvailableMessage, ToastVariant.ERROR);
      } else if (transactionId === "not_ready") {
        toast.show(communicationTexts.notReadyMessage, ToastVariant.ERROR);
      } else {
        dispatch(setTransactionsStateAction(transactionId));

        setTimeout(() => {
          getProposals(governor).then(
            chainProposals => dispatch(replaceProposalsAction(chainProposals)),
            error => console.error(error),
          );
        }, 5000);
      }
    } catch (error) {
      console.error(error);
      toast.show("An error ocurred", ToastVariant.ERROR);
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
