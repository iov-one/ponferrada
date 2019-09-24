import { Address, Algorithm, PubkeyBundle, PubkeyBytes, TokenTicker } from "@iov/bcp";
import { ElectionRule } from "@iov/bns";
import { CommitteeId, Governor, ProposalOptions, ProposalType } from "@iov/bns-governance";
import { Encoding } from "@iov/encoding";
import { FormApi } from "final-form";
import {
  Block,
  Button,
  Form,
  FormValues,
  ToastContext,
  ToastVariant,
  Typography,
  useForm,
} from "medulas-react-components";
import React, { useEffect, useState } from "react";
import * as ReactRedux from "react-redux";
import { Weave } from "ui-logic";

import { communicationTexts } from "../../../communication";
import { sendSignAndPostRequest } from "../../../communication/signandpost";
import { getBnsConnection } from "../../../logic/connection";
import { RootState } from "../../../store/reducers";
import { setTransactionsStateAction } from "../../../store/transactions";
import CommitteeRulesSelect from "./CommitteeRulesSelect";
import DescriptionField, { DESCRIPTION_FIELD } from "./DescriptionField";
import FormOptions from "./FormOptions";
import { COMMITTEE_ADD_FIELD, MEMBER_ADD_FIELD, WEIGHT_FIELD } from "./FormOptions/AddCommitteeMember";
import { POWER_FIELD, PUBKEY_ADD_FIELD } from "./FormOptions/AddValidator";
import { COMMITTEE_QUORUM_FIELD, QUORUM_FIELD } from "./FormOptions/AmendCommitteeQuorum";
import { COMMITTEE_THRESHOLD_FIELD, THRESHOLD_FIELD } from "./FormOptions/AmendCommitteeThreshold";
import { TEXT_FIELD } from "./FormOptions/AmendProtocol";
import { Recipient } from "./FormOptions/DistributeFunds";
import { RELEASE_QUANTITY_FIELD, RELEASE_TICKER_FIELD } from "./FormOptions/ReleaseGuaranteeFunds";
import { COMMITTEE_REMOVE_FIELD, MEMBER_REMOVE_FIELD } from "./FormOptions/RemoveCommitteeMember";
import { PUBKEY_REMOVE_FIELD } from "./FormOptions/RemoveValidator";
import ProposalTypeSelect from "./ProposalTypeSelect";
import TitleField, { TITLE_FIELD } from "./TitleField";
import WhenField, { DATE_FIELD, dateAfterNow } from "./WhenField";

const getCommitteeIdFromForm = (formValue: string): CommitteeId =>
  parseInt(formValue.substring(0, formValue.indexOf(":")), 10) as CommitteeId;

const getPubkeyBundleFromForm = (formValue: string): PubkeyBundle => {
  return {
    algo: Algorithm.Ed25519,
    data: Encoding.fromHex(formValue) as PubkeyBytes,
  };
};

const getElectionRules = async (
  governor: Governor,
  filteredByGovernor = true,
): Promise<readonly ElectionRule[]> => {
  const electorates = await governor.getElectorates(!filteredByGovernor);
  const out: ElectionRule[] = [];
  for (const electorate of electorates) {
    try {
      const electionRules = await governor.getElectionRules(electorate.id);
      out.push(...electionRules);
    } catch (error) {
      // TODO: Remove this error handler once https://github.com/iov-one/iov-core/issues/1239 is done
      if (error.toString().match(/No election rule found for electorate/)) {
        // ignore
      } else {
        throw error;
      }
    }
  }
  return out;
};

export const getAllElectionRules = async (governor: Governor): Promise<readonly ElectionRule[]> => {
  return getElectionRules(governor, false);
};

const ProposalForm = (): JSX.Element => {
  const toast = React.useContext(ToastContext);
  const [proposalType, setProposalType] = useState(ProposalType.AmendProtocol);
  const [electionRules, setElectionRules] = useState<Readonly<ElectionRule[]>>([]);
  const [electionRule, setElectionRule] = useState<ElectionRule>();
  const [recipients, setRecipients] = useState<Readonly<Recipient[]>>([]);

  const governor = ReactRedux.useSelector((state: RootState) => state.extension.governor);
  const dispatch = ReactRedux.useDispatch();

  const buildProposalOptions = (values: FormValues): ProposalOptions => {
    if (!electionRule) throw new Error("Election Rule not set. This is a bug.");

    const title = values[TITLE_FIELD].trim();
    const description = values[DESCRIPTION_FIELD].trim();
    const startTime = new Date(values[DATE_FIELD]);

    const commonOptions = {
      title,
      description,
      startTime,
      electionRuleId: electionRule.id,
    };

    switch (proposalType) {
      case ProposalType.AddCommitteeMember: {
        const committee = getCommitteeIdFromForm(values[COMMITTEE_ADD_FIELD]);
        const address = values[MEMBER_ADD_FIELD] as Address;
        const weight = parseInt(values[WEIGHT_FIELD], 10);

        return { ...commonOptions, type: ProposalType.AddCommitteeMember, committee, address, weight };
      }
      case ProposalType.RemoveCommitteeMember: {
        const committee = getCommitteeIdFromForm(values[COMMITTEE_REMOVE_FIELD]);
        const address = values[MEMBER_REMOVE_FIELD] as Address;

        return { ...commonOptions, type: ProposalType.RemoveCommitteeMember, committee, address };
      }
      case ProposalType.AmendElectionRuleThreshold: {
        const targetElectionRuleId = getCommitteeIdFromForm(values[COMMITTEE_THRESHOLD_FIELD]);
        const thresholdArray = values[THRESHOLD_FIELD].split("/").map(n => parseInt(n, 10));
        const threshold = {
          numerator: thresholdArray[0],
          denominator: thresholdArray[1],
        };

        return {
          ...commonOptions,
          type: ProposalType.AmendElectionRuleThreshold,
          targetElectionRuleId,
          threshold,
        };
      }
      case ProposalType.AmendElectionRuleQuorum: {
        const targetElectionRuleId = getCommitteeIdFromForm(values[COMMITTEE_QUORUM_FIELD]);
        const quorumArray = values[QUORUM_FIELD] && values[QUORUM_FIELD].split("/").map(n => parseInt(n, 10));
        const quorum = quorumArray
          ? {
              numerator: quorumArray[0],
              denominator: quorumArray[1],
            }
          : null;

        return {
          ...commonOptions,
          type: ProposalType.AmendElectionRuleQuorum,
          targetElectionRuleId,
          quorum,
        };
      }
      case ProposalType.AddValidator: {
        const pubkey = getPubkeyBundleFromForm(values[PUBKEY_ADD_FIELD]);
        const power = parseInt(values[POWER_FIELD], 10);

        return { ...commonOptions, type: ProposalType.AddValidator, pubkey, power };
      }
      case ProposalType.RemoveValidator: {
        const pubkey = getPubkeyBundleFromForm(values[PUBKEY_REMOVE_FIELD]);
        return { ...commonOptions, type: ProposalType.RemoveValidator, pubkey };
      }
      case ProposalType.ReleaseGuaranteeFunds: {
        const quantity = values[RELEASE_QUANTITY_FIELD];
        const fractionalDigits = 9;
        const tokenTicker = values[RELEASE_TICKER_FIELD] as TokenTicker;
        const amount = {
          quantity,
          fractionalDigits,
          tokenTicker,
        };

        return {
          ...commonOptions,
          type: ProposalType.ReleaseGuaranteeFunds,
          amount,
        };
      }
      case ProposalType.DistributeFunds: {
        return { ...commonOptions, type: ProposalType.DistributeFunds, recipients };
      }
      case ProposalType.AmendProtocol: {
        const text = values[TEXT_FIELD];
        return { ...commonOptions, type: ProposalType.AmendProtocol, text };
      }
      default:
        throw new Error("Unexpected type of Proposal. This is a bug.");
    }
  };

  const onSubmit = async (values: FormValues, form: FormApi): Promise<void> => {
    if (dateAfterNow(values[DATE_FIELD])) {
      form.resetFieldState(DATE_FIELD);
      return;
    }

    try {
      if (!governor) throw new Error("Governor not set in store. This is a bug.");
      const connection = await getBnsConnection();
      const proposalOptions = buildProposalOptions(values);
      const createProposalTx = await governor.buildCreateProposalTx(proposalOptions);

      const transactionId = await sendSignAndPostRequest(connection, createProposalTx);
      if (transactionId === undefined) {
        toast.show(communicationTexts.notAvailableMessage, ToastVariant.ERROR);
      } else if (transactionId === "not_ready") {
        toast.show(communicationTexts.notReadyMessage, ToastVariant.ERROR);
      } else {
        dispatch(setTransactionsStateAction(transactionId));
      }
    } catch (error) {
      console.error(error);
      const message = Weave.tryParseError(error) || "An unknown error occurred";
      toast.show(message, ToastVariant.ERROR);
    }
  };

  const { form, handleSubmit, invalid, pristine, submitting } = useForm({ onSubmit });

  useEffect(() => {
    const updateElectionRules = async (): Promise<void> => {
      if (!governor) throw new Error("Governor not set in store. This is a bug.");
      const electionRules = await getElectionRules(governor);
      setElectionRules(electionRules);
    };

    updateElectionRules();
  }, [governor]);

  const noRulesSet = !electionRule;

  return (
    <Block flexGrow={1} margin={2}>
      <Typography>Create Proposal</Typography>
      <Form onSubmit={handleSubmit}>
        <Block display="flex" justifyContent="space-between" marginTop={2}>
          <TitleField form={form} />
          <WhenField form={form} />
        </Block>
        <ProposalTypeSelect form={form} changeProposalType={setProposalType} />
        <FormOptions
          form={form}
          proposalType={proposalType}
          electionRule={electionRule}
          recipientsChanged={setRecipients}
        />
        <DescriptionField form={form} />
        <CommitteeRulesSelect
          form={form}
          electionRules={electionRules}
          electionRuleChanged={setElectionRule}
        />
        <Block display="flex" justifyContent="flex-end" marginTop={2}>
          <Button type="submit" disabled={invalid || pristine || submitting || noRulesSet}>
            Publish
          </Button>
        </Block>
      </Form>
    </Block>
  );
};

export default ProposalForm;
