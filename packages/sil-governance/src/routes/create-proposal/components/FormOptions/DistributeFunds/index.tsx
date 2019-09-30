import { Address } from "@iov/bcp";
import { FormApi } from "final-form";
import {
  Block,
  makeStyles,
  TextField,
  ToastContext,
  ToastVariant,
  Typography,
} from "medulas-react-components";
import React, { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { parseRecipients } from "ui-logic";

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
  readonly recipientsChanged: Dispatch<SetStateAction<readonly Recipient[]>>;
}

const DistributeFunds = ({ form, recipientsChanged }: Props): JSX.Element => {
  const inputClasses = useStyles();
  const toast = React.useContext(ToastContext);
  const [recipients, setRecipients] = useState<readonly Recipient[]>([]);

  const updateRecipients = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      setRecipients([]);
      recipientsChanged([]);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") throw new Error("Got unsupported type of file");

      try {
        const recipients = parseRecipients(reader.result);
        setRecipients(recipients);
        recipientsChanged(recipients);
      } catch (error) {
        setRecipients([]);
        recipientsChanged([]);
        toast.show(error.message, ToastVariant.ERROR);
        return;
      }
    };

    const file = files[0];
    reader.readAsText(file);
  };

  const hasRecipients = recipients.length > 0;

  return (
    <React.Fragment>
      <Block marginTop={2} display="flex" alignItems="center">
        <Typography>{IMPORT_FIELD}</Typography>
        <Block marginLeft={2}>
          <TextField
            name={IMPORT_FIELD}
            form={form}
            required
            onChanged={updateRecipients}
            type="file"
            margin="none"
            InputProps={{ classes: inputClasses }}
          />
        </Block>
      </Block>
      {hasRecipients && <RecipientsTable recipients={recipients} />}
    </React.Fragment>
  );
};

export default DistributeFunds;
