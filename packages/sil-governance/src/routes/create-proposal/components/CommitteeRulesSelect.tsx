import { ElectionRule } from "@iov/bns";
import { FormApi } from "final-form";
import { Block, SelectFieldForm, SelectFieldFormItem, Typography } from "medulas-react-components";
import React, { Dispatch, SetStateAction, useState } from "react";
import { displayPeriod } from "ui-logic";

const COMMITTEE_RULES_FIELD = "Committee Rule";
const COMMITTEE_RULES_INITIAL = "Select a rule";

interface Props {
  readonly form: FormApi;
  readonly electionRules: readonly ElectionRule[];
  readonly changeElectionRuleId: Dispatch<SetStateAction<number>>;
}

const CommitteeRulesSelect = ({ form, electionRules, changeElectionRuleId }: Props): JSX.Element => {
  const ruleItems = electionRules.map(rule => {
    return {
      name: `${rule.id}: ${rule.title}`,
    };
  });

  const [quorum, setQuorum] = useState();
  const [threshold, setThreshold] = useState();
  const [period, setPeriod] = useState();

  const changeCommittee = (selectedItem: SelectFieldFormItem): void => {
    const ruleId = parseInt(selectedItem.name.substring(0, selectedItem.name.indexOf(":")), 10);
    const rule = electionRules.find(rule => rule.id === ruleId);
    if (!rule) throw new Error("Selected committee not found. This is a bug.");

    const quorum = rule.quorum ? `${rule.quorum.numerator}/${rule.quorum.denominator}` : "none";
    const threshold = `${rule.threshold.numerator}/${rule.threshold.denominator}`;
    const period = displayPeriod(rule.votingPeriod);

    setQuorum(quorum);
    setThreshold(threshold);
    setPeriod(period);

    changeElectionRuleId(rule.id);
  };

  return (
    <Block marginTop={2} display="flex" flexDirection="column">
      <Block display="flex" alignItems="center">
        <Typography>{COMMITTEE_RULES_FIELD}</Typography>
        <Block marginLeft={2}>
          <SelectFieldForm
            fieldName={COMMITTEE_RULES_FIELD}
            fullWidth
            form={form}
            items={ruleItems}
            initial={COMMITTEE_RULES_INITIAL}
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

export default CommitteeRulesSelect;
