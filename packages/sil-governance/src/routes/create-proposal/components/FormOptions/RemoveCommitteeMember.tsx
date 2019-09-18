import { FormApi } from "final-form";
import {
  Block,
  FieldInputValue,
  required,
  SelectField,
  SelectFieldItem,
  TextField,
  Typography,
} from "medulas-react-components";
import React, { useEffect, useState } from "react";
import * as ReactRedux from "react-redux";

import { RootState } from "../../../../store/reducers";

export const COMMITTEE_REMOVE_FIELD = "Committee";
const COMMITTEE_REMOVE_INITIAL = "Select a committee";
export const MEMBER_REMOVE_FIELD = "Member Address to Remove";
const MEMBER_REMOVE_PLACEHOLDER = "Enter the address of the member to remove";

interface Props {
  readonly form: FormApi;
}

const RemoveCommitteeMember = ({ form }: Props): JSX.Element => {
  const governor = ReactRedux.useSelector((state: RootState) => state.extension.governor);
  const [committeeItems, setCommitteeItems] = useState<SelectFieldItem[]>([]);

  useEffect(() => {
    const updateCommitteeItems = async (): Promise<void> => {
      if (!governor) throw new Error("Governor not set in store. This is a bug.");
      const allElectorates = await governor.getElectorates(true);
      const committeeItems = allElectorates.map(electorate => {
        return {
          name: `${electorate.id}: ${electorate.title}`,
        };
      });

      setCommitteeItems(committeeItems);
    };

    updateCommitteeItems();
  }, [governor]);

  const committeeValidator = (value: FieldInputValue): string | undefined => {
    if (value === COMMITTEE_REMOVE_INITIAL) return "Must select a committee";
    return undefined;
  };

  return (
    <React.Fragment>
      <Block marginTop={2} display="flex" alignItems="center">
        <Typography>{COMMITTEE_REMOVE_FIELD}</Typography>
        <Block marginLeft={2}>
          <SelectField
            fieldName={COMMITTEE_REMOVE_FIELD}
            form={form}
            validate={committeeValidator}
            fullWidth
            items={committeeItems}
            initial={COMMITTEE_REMOVE_INITIAL}
          />
        </Block>
      </Block>

      <Block marginTop={2} display="flex" alignItems="center">
        <Typography>{MEMBER_REMOVE_FIELD}</Typography>
        <Block marginLeft={2} flexGrow={1}>
          <TextField
            name={MEMBER_REMOVE_FIELD}
            form={form}
            validate={required}
            placeholder={MEMBER_REMOVE_PLACEHOLDER}
            fullWidth
            margin="none"
          />
        </Block>
      </Block>
    </React.Fragment>
  );
};

export default RemoveCommitteeMember;
