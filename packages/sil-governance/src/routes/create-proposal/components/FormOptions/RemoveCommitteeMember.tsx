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

export const COMMITTEE_REMOVE_FIELD = "Committee";
const COMMITTEE_REMOVE_INITIAL = "Select a committee";
export const MEMBER_REMOVE_FIELD = "Member Address to Remove";
const MEMBER_REMOVE_PLACEHOLDER = "Enter the address of the member to remove";

interface Props {
  readonly form: FormApi;
}

const RemoveCommitteeMember = ({ form }: Props): JSX.Element => {
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
        <Typography>{COMMITTEE_REMOVE_FIELD}</Typography>
        <Block marginLeft={2}>
          <SelectFieldForm
            fieldName={COMMITTEE_REMOVE_FIELD}
            fullWidth
            form={form}
            items={committeeItems}
            initial={COMMITTEE_REMOVE_INITIAL}
          />
        </Block>
      </Block>

      <Block marginTop={2} display="flex" alignItems="center">
        <Typography>{MEMBER_REMOVE_FIELD}</Typography>
        <Block marginLeft={2} flexGrow={1}>
          <TextFieldForm
            name={MEMBER_REMOVE_FIELD}
            form={form}
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
