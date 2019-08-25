import { ProposalOptions, ProposalType } from "@iov/bns-governance";
import { Block, Button, Form, FormValues, Typography, useForm } from "medulas-react-components";
import React, { useState } from "react";
import * as ReactRedux from "react-redux";

import { sendSignAndPostRequest } from "../../../communication/signandpost";
import { getBnsConnection } from "../../../logic/connection";
import { RootState } from "../../../store/reducers";
import DescriptionField from "./DescriptionField";
import FormOptions from "./FormOptions";
import ParticipationData from "./ParticipationData";
import ProposalTypeSelect from "./ProposalTypeSelect";
import TitleField from "./TitleField";
import WhenField from "./WhenField";

const buildProposalOptions = (type: ProposalType, values: FormValues): ProposalOptions => {
  const [year, month, day] = values["Date"].split("-").map(el => parseInt(el, 10));
  const [hour, minute] = values["Time"].split(":").map(el => parseInt(el, 10));

  const title = values["Title"];
  const description = values["Description"];
  const startTime = new Date(year, month - 1, day, hour, minute);
  //TODO Get Election Rule from values when the UI for selecting committee is done
  const electionRuleId = 1;

  const commonOptions = {
    title,
    description,
    startTime,
    electionRuleId,
  };

  const text = values["Text"];

  switch (type) {
    case ProposalType.AmendProtocol:
      return { ...commonOptions, type: ProposalType.AmendProtocol, text };
    default:
      throw new Error("Unexpected type of Proposal. This is a bug.");
  }
};

const ProposalForm = (): JSX.Element => {
  const [proposalType, setProposalType] = useState(ProposalType.AmendProtocol);
  const governor = ReactRedux.useSelector((state: RootState) => state.extension.governor);

  const getElectionRules = async (governor: Governor): Promise<readonly ElectionRule[]> => {
    if (!governor) throw new Error("Governor not set in store. This is a bug.");

    const electorates = await governor.getElectorates();
    let allElectionRules: ElectionRule[] = [];

    for (const electorate of electorates) {
      const electionRules = await governor.getElectionRules(electorate.id);
      allElectionRules = [...allElectionRules, ...electionRules];
    }

    return allElectionRules;
  };

  const onSubmit = async (values: FormValues): Promise<void> => {
    if (!governor) throw new Error("Governor not set in store. This is a bug.");

    const connection = await getBnsConnection();
    const proposalOptions = buildProposalOptions(proposalType, values);
    const createProposalTx = await governor.buildCreateProposalTx(proposalOptions);

    await sendSignAndPostRequest(connection, createProposalTx);
  };

  const { form, handleSubmit, invalid, pristine, submitting } = useForm({
    onSubmit,
  });

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
        <ParticipationData />
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
