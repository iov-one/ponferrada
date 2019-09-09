import { FormApi } from "final-form";
import {
  Block,
  composeValidators,
  required,
  SelectFieldForm,
  SelectFieldFormItem,
  TextFieldForm,
  Typography,
} from "medulas-react-components";
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import * as ReactRedux from "react-redux";
import { isFraction } from ".";
import { RootState } from "../../../../store/reducers";
import { getElectionRules } from "../ProposalForm";

export const COMMITTEE_THRESHOLD_FIELD = "Committee Rule to amend";
const COMMITTEE_THRESHOLD_INITIAL = "Select a rule";
export const THRESHOLD_FIELD = "Threshold";
const THRESHOLD_PLACEHOLDER = "2/3";

interface Props {
  readonly form: FormApi;
  readonly changeAmendElectionRuleId: Dispatch<SetStateAction<number | undefined>>;
}

const AmendCommitteeThreshold = ({ form, changeAmendElectionRuleId }: Props): JSX.Element => {
  const governor = ReactRedux.useSelector((state: RootState) => state.extension.governor);
  const [ruleItems, setRuleItems] = useState<SelectFieldFormItem[]>([]);

  const changeCommittee = (selectedItem: SelectFieldFormItem): void => {
    const electorateId = parseInt(selectedItem.name.substring(0, selectedItem.name.indexOf(":")), 10);
    changeAmendElectionRuleId(electorateId);
  };

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

  const thresholdValidator = useMemo(() => composeValidators(required, isFraction), []);

  return (
    <React.Fragment>
      <Block marginTop={2} display="flex" alignItems="center">
        <Typography>{COMMITTEE_THRESHOLD_FIELD}</Typography>
        <Block marginLeft={2}>
          <SelectFieldForm
            fieldName={COMMITTEE_THRESHOLD_FIELD}
            fullWidth
            form={form}
            items={ruleItems}
            initial={COMMITTEE_THRESHOLD_INITIAL}
            onChangeCallback={changeCommittee}
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
