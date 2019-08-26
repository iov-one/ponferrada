import { ElectionRule } from "@iov/bns";
import { FormApi } from "final-form";
import { Block, SelectFieldForm, Typography } from "medulas-react-components";
import React, { Dispatch, SetStateAction, useState } from "react";

export const COMMITTEE_FIELD = "Committee";
const COMMITTEE_FIELD_INITIAL = "Select a committee";

interface Props {
  form: FormApi;
  electionRules: ElectionRule[];
  changeElectionRuleId: Dispatch<SetStateAction<number>>;
}

const CommitteeSelect = ({ form, electionRules, changeElectionRuleId }: Props): JSX.Element => {
  const committeeItems = electionRules.map(rule => {
    return {
      name: rule.title,
    };
  });

  const [quorum, setQuorum] = useState();
  const [threshold, setThreshold] = useState();
  const [period, setPeriod] = useState();

  const changeCommittee = (committeeName: string): void => {
    const committee = electionRules.find(rule => rule.title === committeeName);
    if (!committee) throw new Error("Selected committee not found. This is a bug.");

    const quorum = committee.quorum
      ? `${committee.quorum.numerator}/${committee.quorum.denominator}`
      : "none";
    const threshold = `${committee.threshold.numerator}/${committee.threshold.denominator}`;
    //TODO show bigger and smaller timeframes
    const period = `${Math.floor(committee.votingPeriod / 3600)}h`;

    setQuorum(quorum);
    setThreshold(threshold);
    setPeriod(period);

    changeElectionRuleId(committee.id);
  };

  return (
    <Block marginTop={2} display="flex" flexDirection="column">
      <Block display="flex" alignItems="center">
        <Typography>{COMMITTEE_FIELD}</Typography>
        <Block marginLeft={2}>
          <SelectFieldForm
            fieldName={COMMITTEE_FIELD}
            fullWidth
            form={form}
            items={committeeItems}
            initial={COMMITTEE_FIELD_INITIAL}
            onChangeCallback={selectedItem => changeCommittee(selectedItem.name)}
          />
        </Block>
      </Block>
      <Block display="flex" justifyContent="space-between" marginTop={2}>
        <Typography>Quorum: {quorum}</Typography>
        <Typography>Threshold: {threshold}</Typography>
        <Typography>Period: {period}</Typography>
      </Block>
    </Block>
  );
};

export default CommitteeSelect;
