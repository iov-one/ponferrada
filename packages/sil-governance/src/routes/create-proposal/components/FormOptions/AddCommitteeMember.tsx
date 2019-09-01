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

export const COMMITTEE_ADD_FIELD = "Committee";
const COMMITTEE_ADD_INITIAL = "Select a committee";
export const MEMBER_ADD_FIELD = "New Member Address";
const MEMBER_ADD_PLACEHOLDER = "Enter the address for the new member";
export const WEIGHT_FIELD = "Weight";
const WEIGHT_PLACEHOLDER = "0";

interface Props {
  readonly form: FormApi;
}

const AddCommitteeMember = ({ form }: Props): JSX.Element => {
  const governor = ReactRedux.useSelector((state: RootState) => state.extension.governor);
  const [committeeItems, setCommitteeItems] = useState<SelectFieldFormItem[]>([]);

  useEffect(() => {
    const updateCommitteeItems = async (): Promise<void> => {
      if (!governor) throw new Error("Governor not set in store. This is a bug.");
      const electorates = await governor.getElectorates();
      const committeeItems = electorates.map(electorate => {
        return {
          name: `${electorate.id}: ${electorate.title}`,
        };
      });

      setCommitteeItems(committeeItems);
    };

    updateCommitteeItems();
  }, [governor]);

  return (
    <React.Fragment>
      <Block marginTop={2} display="flex" alignItems="center">
        <Typography>{COMMITTEE_ADD_FIELD}</Typography>
        <Block marginLeft={2}>
          <SelectFieldForm
            fieldName={COMMITTEE_ADD_FIELD}
            fullWidth
            form={form}
            items={committeeItems}
            initial={COMMITTEE_ADD_INITIAL}
          />
        </Block>
      </Block>

      <Block marginTop={2} display="flex" alignItems="center">
        <Typography>{MEMBER_ADD_FIELD}</Typography>
        <Block marginLeft={2} flexGrow={1}>
          <TextFieldForm
            name={MEMBER_ADD_FIELD}
            form={form}
            placeholder={MEMBER_ADD_PLACEHOLDER}
            fullWidth
            margin="none"
          />
        </Block>
      </Block>
      <Block marginTop={2} display="flex" alignItems="center">
        <Typography>{WEIGHT_FIELD}</Typography>
        <Block marginLeft={2}>
          <TextFieldForm name={WEIGHT_FIELD} form={form} placeholder={WEIGHT_PLACEHOLDER} margin="none" />
        </Block>
      </Block>
    </React.Fragment>
  );
};

export default AddCommitteeMember;
