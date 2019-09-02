import { FormApi } from "final-form";
import {
  Block,
  SelectFieldForm,
  SelectFieldFormItem,
  TextFieldForm,
  Typography,
} from "medulas-react-components";
import React, { useEffect, useState } from "react";
import * as ReactRedux from "react-redux";

import { RootState } from "../../../../store/reducers";
import { getElectionRules } from "../ProposalForm";

export const COMMITTEE_QUORUM_FIELD = "Committee Rule to amend";
const COMMITTEE_QUORUM_INITIAL = "Select a rule";
export const QUORUM_FIELD = "Quorum";
const QUORUM_PLACEHOLDER = "2/3";

interface Props {
  readonly form: FormApi;
}

const AmendCommitteeQuorum = ({ form }: Props): JSX.Element => {
  const governor = ReactRedux.useSelector((state: RootState) => state.extension.governor);
  const [ruleItems, setRuleItems] = useState<SelectFieldFormItem[]>([]);

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
          />
        </Block>
      </Block>

      <Block marginTop={2} display="flex" alignItems="center">
        <Typography>{QUORUM_FIELD}</Typography>
        <Block marginLeft={2}>
          <TextFieldForm name={QUORUM_FIELD} form={form} placeholder={QUORUM_PLACEHOLDER} margin="none" />
        </Block>
      </Block>
    </React.Fragment>
  );
};

export default AmendCommitteeQuorum;
