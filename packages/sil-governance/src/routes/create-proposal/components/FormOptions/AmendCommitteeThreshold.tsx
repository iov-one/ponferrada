import { ChainId } from "@iov/bcp";
import { ElectionRule, electionRuleIdToAddress } from "@iov/bns";
import { FieldValidator, FormApi } from "final-form";
import {
  Block,
  composeValidators,
  FieldInputValue,
  required,
  SelectField,
  SelectFieldItem,
  TextField,
  Typography,
} from "medulas-react-components";
import React, { useEffect, useMemo, useState } from "react";
import * as ReactRedux from "react-redux";

import { getConfig } from "../../../../config";
import { RootState } from "../../../../store/reducers";
import { getAllElectionRules } from "../ProposalForm";
import { isFraction } from ".";

export const COMMITTEE_THRESHOLD_FIELD = "Committee Rule to amend";
const COMMITTEE_THRESHOLD_INITIAL = "Select a rule";
export const THRESHOLD_FIELD = "Threshold";
const THRESHOLD_PLACEHOLDER = "2/3";

const committeeIsSet = (value: FieldInputValue): string | undefined => {
  if (value === COMMITTEE_THRESHOLD_INITIAL) return "Must select a rule";
  return undefined;
};

interface Props {
  readonly form: FormApi;
  readonly electionRule: ElectionRule | undefined;
}

const AmendCommitteeThreshold = ({ form, electionRule }: Props): JSX.Element => {
  const governor = ReactRedux.useSelector((state: RootState) => state.extension.governor);
  const [ruleItems, setRuleItems] = useState<SelectFieldItem[]>([]);

  useEffect(() => {
    const reloadRuleItems = async (): Promise<void> => {
      const chainId = (await getConfig()).bnsChain.chainSpec.chainId as ChainId;
      const electionRuleAddress = electionRule ? electionRuleIdToAddress(chainId, electionRule.id) : null;

      if (!governor) throw new Error("Governor not set in store. This is a bug.");
      const allRules = await getAllElectionRules(governor);
      const writeableRules = allRules.filter(rule => rule.admin === electionRuleAddress);
      const ruleItems = writeableRules.map(rule => {
        return {
          name: `${rule.id}: ${rule.title}`,
        };
      });

      setRuleItems(ruleItems);
      // Trigger revalidation of committee selection
      form.resetFieldState(COMMITTEE_THRESHOLD_FIELD);
    };

    reloadRuleItems();
  }, [electionRule, form, governor]);

  const committeeValidator = useMemo(() => {
    const availableRulesValidator: FieldValidator<FieldInputValue> = (
      value: FieldInputValue,
      allValues,
    ): string | undefined => {
      console.log(allValues);

      const selection = value || "";
      if (!ruleItems.map(item => item.name).includes(selection)) return "Selected value is not available.";
      return undefined;
    };
    return composeValidators(committeeIsSet, availableRulesValidator);
  }, [ruleItems]);
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
          <TextField
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
