import { TxCodec } from "@iov/bcp";
import { FieldValidator, FormApi } from "final-form";
import {
  Block,
  composeValidators,
  FieldInputValue,
  required,
  TextField,
  Typography,
} from "medulas-react-components";
import React from "react";

import { isIov } from "../../../../logic/account";

export const ADDRESS_FIELD = "addressField";

interface Props {
  readonly form: FormApi;
  readonly selectedChainCodec: TxCodec | null;
}

const ReceiverAddress = ({ form, selectedChainCodec }: Props): JSX.Element => {
  const recipientValidator = React.useMemo(() => {
    const validator: FieldValidator<FieldInputValue> = (value): string | undefined => {
      if (typeof value !== "string") throw new Error("Input must be a string");

      if (isIov(value) || (selectedChainCodec && selectedChainCodec.isValidAddress(value))) {
        return undefined;
      } else {
        return "Must be an IOV human readable address or a native address";
      }
    };

    return validator;
  }, [selectedChainCodec]);

  const validator = React.useMemo(() => {
    return composeValidators(required, recipientValidator);
  }, [recipientValidator]);

  return (
    <Block width="100%" marginTop={4} display="flex" flexDirection="column">
      <Typography color="textPrimary" variant="subtitle2">
        To
      </Typography>
      <Block width="100%" marginTop={1}>
        <TextField
          name={ADDRESS_FIELD}
          form={form}
          validate={validator}
          placeholder="Recipient's address"
          disabled={selectedChainCodec === null}
          fullWidth
          margin="none"
        />
      </Block>
    </Block>
  );
};

export default ReceiverAddress;
