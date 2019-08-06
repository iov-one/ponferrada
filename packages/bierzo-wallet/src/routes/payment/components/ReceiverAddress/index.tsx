import { TxCodec } from "@iov/bcp";
import Paper from "@material-ui/core/Paper";
import { FieldValidator, FormApi } from "final-form";
import Block from "medulas-react-components/lib/components/Block";
import TextFieldForm from "medulas-react-components/lib/components/forms/TextFieldForm";
import Tooltip from "medulas-react-components/lib/components/Tooltip";
import Typography from "medulas-react-components/lib/components/Typography";
import {
  composeValidators,
  FieldInputValue,
  required,
} from "medulas-react-components/lib/utils/forms/validators";
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
    <Paper>
      <Block display="flex" flexDirection="column" width="100%" padding={5}>
        <Typography color="textPrimary" variant="subtitle2">
          To
        </Typography>
        <Block width="100%" marginTop={2} marginBottom={1}>
          <TextFieldForm
            name={ADDRESS_FIELD}
            form={form}
            validate={validator}
            placeholder="IOV or wallet address"
            disabled={selectedChainCodec === null}
            fullWidth
            margin="none"
          />
        </Block>
        <Block display="flex" alignSelf="flex-end" marginTop={3}>
          <Typography color="textPrimary" variant="subtitle1">
            How it works
          </Typography>
          <Block alignSelf="center" marginLeft={1}>
            <Tooltip>
              <Typography variant="body2">
                Send payments to anyone with an IOV handle, and it will go directly to their account. If they
                don’t have an IOV account add their blockchain address.
              </Typography>
            </Tooltip>
          </Block>
        </Block>
      </Block>
    </Paper>
  );
};

export default ReceiverAddress;
