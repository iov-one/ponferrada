import { ElectionRule } from "@iov/bns";
import { Governor, ProposalOptions, ProposalType } from "@iov/bns-governance";
import { Block, Button, Form, FormValues, Typography, useForm } from "medulas-react-components";
import React, { useEffect, useState } from "react";
import * as ReactRedux from "react-redux";

import { sendSignAndPostRequest } from "../../../communication/signandpost";
import { getBnsConnection } from "../../../logic/connection";
import { RootState } from "../../../store/reducers";
import CommitteeRulesSelect from "./CommitteeRulesSelect";
import DescriptionField, { DESCRIPTION_FIELD } from "./DescriptionField";
import FormOptions from "./FormOptions";
import { TEXT_FIELD } from "./FormOptions/AmendProtocol";
import ProposalTypeSelect from "./ProposalTypeSelect";
import TitleField, { TITLE_FIELD } from "./TitleField";
import WhenField, { DATE_FIELD, TIME_FIELD } from "./WhenField";

const getElectionRules = async (governor: Governor): Promise<readonly ElectionRule[]> => {
  const electorates = await governor.getElectorates();
  let allElectionRules: ElectionRule[] = [];

  for (const electorate of electorates) {
    const electionRules = await governor.getElectionRules(electorate.id);
    allElectionRules = [...allElectionRules, ...electionRules];
  }

  return allElectionRules;
};

const ProposalForm = (): JSX.Element => {
  const governor = ReactRedux.useSelector((state: RootState) => state.extension.governor);
  const [proposalType, setProposalType] = useState(ProposalType.AmendProtocol);
  const [electionRules, setElectionRules] = useState<Readonly<ElectionRule[]>>([]);
  const [electionRuleId, setElectionRuleId] = useState();

  const buildProposalOptions = (values: FormValues): ProposalOptions => {
    const [year, month, day] = values[DATE_FIELD].split("-").map(el => parseInt(el, 10));
    const [hour, minute] = values[TIME_FIELD].split(":").map(el => parseInt(el, 10));

    const title = values[TITLE_FIELD];
    const description = values[DESCRIPTION_FIELD];
    const startTime = new Date(year, month - 1, day, hour, minute);

    const commonOptions = {
      title,
      description,
      startTime,
      electionRuleId,
    };

    const text = values[TEXT_FIELD];

    switch (proposalType) {
      case ProposalType.AmendProtocol:
        return { ...commonOptions, type: ProposalType.AmendProtocol, text };
      default:
        throw new Error("Unexpected type of Proposal. This is a bug.");
    }
  };

  const onSubmit = async (values: FormValues): Promise<void> => {
    if (!governor) throw new Error("Governor not set in store. This is a bug.");

    const connection = await getBnsConnection();
    const proposalOptions = buildProposalOptions(values);
    const createProposalTx = await governor.buildCreateProposalTx(proposalOptions);

    await sendSignAndPostRequest(connection, createProposalTx);
  };

  const { form, handleSubmit, invalid, pristine, submitting } = useForm({
    onSubmit,
  });

  useEffect(() => {
    const updateElectionRules = async (): Promise<void> => {
      if (!governor) throw new Error("Governor not set in store. This is a bug.");
      const electionRules = await getElectionRules(governor);
      setElectionRules(electionRules);
    };

    updateElectionRules();
  }, [governor]);

  return (
    <Block flexGrow={1} margin={2}>
      <Typography>Create Proposal</Typography>
      <Form onSubmit={handleSubmit}>
        <Block display="flex" justifyContent="space-between" marginTop={2}>
          <TitleField form={form} />
          <WhenField form={form} />
        </Block>
        <ProposalTypeSelect form={form} changeProposalType={setProposalType} />
        <FormOptions form={form} proposalType={proposalType} />
        <DescriptionField form={form} />
        <CommitteeRulesSelect
          form={form}
          electionRules={electionRules}
          changeElectionRuleId={setElectionRuleId}
        />
        <Block display="flex" justifyContent="flex-end" marginTop={2}>
          <Button type="submit" disabled={invalid || pristine || submitting}>
            Publish
          </Button>
        </Block>
      </Form>
    </Block>
  );
};

export default ProposalForm;
