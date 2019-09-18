import { FormApi } from "final-form";
import {
  Block,
  composeValidators,
  FieldInputValue,
  required,
  SelectField,
  SelectFieldItem,
  TextFieldForm,
  Typography,
} from "medulas-react-components";
import React, { useEffect, useState } from "react";
import * as ReactRedux from "react-redux";

import { RootState } from "../../../../store/reducers";
import { getElectionRules } from "../ProposalForm";
import { isFraction } from ".";

export const COMMITTEE_THRESHOLD_FIELD = "Committee Rule to amend";
const COMMITTEE_THRESHOLD_INITIAL = "Select a rule";
export const THRESHOLD_FIELD = "Threshold";
const THRESHOLD_PLACEHOLDER = "2/3";

interface Props {
  readonly form: FormApi;
}

const AmendCommitteeThreshold = ({ form }: Props): JSX.Element => {
  const governor = ReactRedux.useSelector((state: RootState) => state.extension.governor);
  const [ruleItems, setRuleItems] = useState<SelectFieldItem[]>([]);

  useEffect(() => {
    const reloadRuleItems = async (): Promise<void> => {
      if (!governor) throw new Error("Governor not set in store. This is a bug.");
      const electionRules = await getElectionRules(governor);
      const ruleItems = electionRules.map(rule => {
        return {
          name: `${rule.id}: ${rule.title}`,
        };
      });

      setRuleItems(ruleItems);
    };

    reloadRuleItems();
  }, [governor]);

  const committeeValidator = (value: FieldInputValue): string | undefined => {
    if (value === COMMITTEE_THRESHOLD_INITIAL) return "Must select a rule";
    return undefined;
  };

  const thresholdValidator = composeValidators(required, isFraction);

  return (
    <React.Fragment>
      <Block marginTop={2} display="flex" alignItems="center">
        <Typography>{COMMITTEE_THRESHOLD_FIELD}</Typography>
        <Block marginLeft={2}>
          <SelectField
            fieldName={COMMITTEE_THRESHOLD_FIELD}
            form={form}
            validate={committeeValidator}
            fullWidth
            items={ruleItems}
            initial={COMMITTEE_THRESHOLD_INITIAL}
          />
        </Block>
      </Block>

      <Block marginTop={2} display="flex" alignItems="center">
        <Typography>{THRESHOLD_FIELD}</Typography>
        <Block marginLeft={2}>
          <TextFieldForm
            name={THRESHOLD_FIELD}
            form={form}
            validate={thresholdValidator}
            placeholder={THRESHOLD_PLACEHOLDER}
            margin="none"
          />
        </Block>
      </Block>
    </React.Fragment>
  );
};

export default AmendCommitteeThreshold;
