import { FieldValidator, FormApi } from "final-form";
import {
  Block,
  FieldInputValue,
  SelectFieldForm,
  SelectFieldFormItem,
  TextFieldForm,
  Typography,
} from "medulas-react-components";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import * as ReactRedux from "react-redux";
import { isNumber } from "util";

import { RootState } from "../../../../store/reducers";
import { getElectionRules } from "../ProposalForm";

export const COMMITTEE_QUORUM_FIELD = "Committee Rule to amend";
const COMMITTEE_QUORUM_INITIAL = "Select a rule";
export const QUORUM_FIELD = "Quorum";
const QUORUM_PLACEHOLDER = "2/3";

interface Props {
  readonly form: FormApi;
  readonly changeAmendElectionRuleId: Dispatch<SetStateAction<number | undefined>>;
}

const AmendCommitteeQuorum = ({ form, changeAmendElectionRuleId }: Props): JSX.Element => {
  const governor = ReactRedux.useSelector((state: RootState) => state.extension.governor);
  const [ruleItems, setRuleItems] = useState<SelectFieldFormItem[]>([]);

  const changeCommittee = (selectedItem: SelectFieldFormItem): void => {
    const electorateId = parseInt(selectedItem.name.substring(0, selectedItem.name.indexOf(":")), 10);
    changeAmendElectionRuleId(electorateId);
  };

  useEffect(() => {
    const updateCommitteeItems = async (): Promise<void> => {
      if (!governor) throw new Error("Governor not set in store. This is a bug.");
      const electionRules = await getElectionRules(governor);
      const ruleItems = electionRules.map(rule => {
        return {
          name: `${rule.id}: ${rule.title}`,
        };
      });

      setRuleItems(ruleItems);
    };

    updateCommitteeItems();
  }, [governor]);

  const isFractionOrEmpty = React.useMemo(() => {
    const validator: FieldValidator<FieldInputValue> = (value): string | undefined => {
      if (!value) return undefined;
      if (typeof value !== "string") throw new Error("Input must be a string");

      const members = value.split("/");
      const numerator = parseInt(members[0], 10);
      const denominator = parseInt(members[1], 10);

      if (isNumber(numerator) && isNumber(denominator) && numerator <= denominator) {
        return undefined;
      } else {
        return "Must be a valid fraction or empty";
      }
    };

    return validator;
  }, []);

  return (
    <React.Fragment>
      <Block marginTop={2} display="flex" alignItems="center">
        <Typography>{COMMITTEE_QUORUM_FIELD}</Typography>
        <Block marginLeft={2}>
          <SelectFieldForm
            fieldName={COMMITTEE_QUORUM_FIELD}
            fullWidth
            form={form}
            items={ruleItems}
            initial={COMMITTEE_QUORUM_INITIAL}
            onChangeCallback={changeCommittee}
          />
        </Block>
      </Block>

      <Block marginTop={2} display="flex" alignItems="center">
        <Typography>{QUORUM_FIELD}</Typography>
        <Block marginLeft={2}>
          <TextFieldForm
            name={QUORUM_FIELD}
            form={form}
            validate={isFractionOrEmpty}
            placeholder={QUORUM_PLACEHOLDER}
            margin="none"
          />
        </Block>
      </Block>
    </React.Fragment>
  );
};

export default AmendCommitteeQuorum;
