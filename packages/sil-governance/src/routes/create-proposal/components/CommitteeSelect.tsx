import { ElectionRule } from "@iov/bns";
import { FormApi } from "final-form";
import { Block, SelectFieldForm, SelectFieldFormItem, Typography } from "medulas-react-components";
import React, { Dispatch, SetStateAction, useState } from "react";

export const COMMITTEE_FIELD = "Committee";
const COMMITTEE_FIELD_INITIAL = "Select a committee";

const displayPeriod = (seconds: number): string => {
  const days = Math.floor(seconds / (3600 * 24));
  seconds -= days * 3600 * 24;
  const hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  const minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  let period = "";
  if (days) period += `${days}d `;
  if (hours) period += `${hours}h `;
  if (minutes) period += `${minutes}m `;
  if (seconds) period += `${seconds}s`;

  return period.trim();
};

interface Props {
  readonly form: FormApi;
  readonly electionRules: readonly ElectionRule[];
  readonly changeElectionRuleId: Dispatch<SetStateAction<number>>;
}

const CommitteeSelect = ({ form, electionRules, changeElectionRuleId }: Props): JSX.Element => {
  const committeeItems = electionRules.map(rule => {
    return {
      name: `${rule.id}: ${rule.title}`,
    };
  });

  const [quorum, setQuorum] = useState();
  const [threshold, setThreshold] = useState();
  const [period, setPeriod] = useState();

  const changeCommittee = (selectedItem: SelectFieldFormItem): void => {
    const committeeId = parseInt(selectedItem.name.substring(0, selectedItem.name.indexOf(":")), 10);
    const committee = electionRules.find(rule => rule.id === committeeId);
    if (!committee) throw new Error("Selected committee not found. This is a bug.");

    const quorum = committee.quorum
      ? `${committee.quorum.numerator}/${committee.quorum.denominator}`
      : "none";
    const threshold = `${committee.threshold.numerator}/${committee.threshold.denominator}`;
    const period = displayPeriod(committee.votingPeriod);

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
            onChangeCallback={changeCommittee}
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
