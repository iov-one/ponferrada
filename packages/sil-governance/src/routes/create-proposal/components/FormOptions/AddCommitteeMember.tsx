import { FormApi } from "final-form";
import {
  Block,
  composeValidators,
  greaterOrEqualThan,
  required,
  SelectFieldForm,
  SelectFieldFormItem,
  TextFieldForm,
  Typography,
} from "medulas-react-components";
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import * as ReactRedux from "react-redux";

import { RootState } from "../../../../store/reducers";

export const COMMITTEE_ADD_FIELD = "Committee";
const COMMITTEE_ADD_INITIAL = "Select a committee";

export const MEMBER_ADD_FIELD = "New Member Address";
const MEMBER_ADD_PLACEHOLDER = "Enter the address for the new member";

export const WEIGHT_FIELD = "Weight";
const WEIGHT_MIN_VALUE = 1;
const WEIGHT_PLACEHOLDER = WEIGHT_MIN_VALUE.toString();

interface Props {
  readonly form: FormApi;
  readonly changeElectorateId: Dispatch<SetStateAction<number>>;
}

const AddCommitteeMember = ({ form, changeElectorateId }: Props): JSX.Element => {
  const governor = ReactRedux.useSelector((state: RootState) => state.extension.governor);
  const [committeeItems, setCommitteeItems] = useState<SelectFieldFormItem[]>([]);

  const changeCommittee = (selectedItem: SelectFieldFormItem): void => {
    const electorateId = parseInt(selectedItem.name.substring(0, selectedItem.name.indexOf(":")), 10);
    changeElectorateId(electorateId);
  };

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

  const weightValidator = useMemo(
    () => composeValidators(required, greaterOrEqualThan(WEIGHT_MIN_VALUE)),
    [],
  );

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
            onChangeCallback={changeCommittee}
          />
        </Block>
      </Block>

      <Block marginTop={2} display="flex" alignItems="center">
        <Typography>{MEMBER_ADD_FIELD}</Typography>
        <Block marginLeft={2} flexGrow={1}>
          <TextFieldForm
            name={MEMBER_ADD_FIELD}
            form={form}
            validate={required}
            placeholder={MEMBER_ADD_PLACEHOLDER}
            fullWidth
            margin="none"
          />
        </Block>
      </Block>
      <Block marginTop={2} display="flex" alignItems="center">
        <Typography>{WEIGHT_FIELD}</Typography>
        <Block marginLeft={2}>
          <TextFieldForm
            name={WEIGHT_FIELD}
            form={form}
            type="number"
            validate={weightValidator}
            placeholder={WEIGHT_PLACEHOLDER}
            margin="none"
          />
        </Block>
      </Block>
    </React.Fragment>
  );
};

export default AddCommitteeMember;
