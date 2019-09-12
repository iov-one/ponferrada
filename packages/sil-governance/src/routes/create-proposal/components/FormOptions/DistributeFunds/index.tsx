import { Address } from "@iov/bcp";
import { FormApi } from "final-form";
import { Block, makeStyles, TextFieldForm, Typography } from "medulas-react-components";
import React, { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

import RecipientsTable from "./RecipientsTable";

const IMPORT_FIELD = "Import recipients";

export interface Recipient {
  address: Address;
  weight: number;
}

const useStyles = makeStyles(() => ({
  root: {
    margin: 0,
  },
  input: {
    padding: 0,
  },
  notchedOutline: {
    border: 0,
  },
}));

interface Props {
  readonly form: FormApi;
  readonly changeRecipients: Dispatch<SetStateAction<Recipient[]>>;
}

const DistributeFunds = ({ form, changeRecipients }: Props): JSX.Element => {
  const inputClasses = useStyles();

  const updateRecipients = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      changeRecipients([]);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const recipients = text
        // split per new line
        .split(/\r\n|\r|\n/)
        // remove empty lines
        .filter(str => str.length > 0)
        // generate Recipient[]
        .map(recipient => {
          const [address, weight] = recipient.split(",");
          return { address: address as Address, weight: parseInt(weight, 10) };
        });

      changeRecipients(recipients);
    };

    const file = files[0];
    reader.readAsText(file);
  };

  return (
    <React.Fragment>
      <Block marginTop={2} display="flex" alignItems="center">
        <Typography>{IMPORT_FIELD}</Typography>
        <Block marginLeft={2}>
          <TextFieldForm
            name={IMPORT_FIELD}
            form={form}
            required
            type="file"
            margin="none"
            InputProps={{ classes: inputClasses }}
            onChange={updateRecipients}
          />
        </Block>
      </Block>
    </React.Fragment>
  );
};

export default DistributeFunds;
