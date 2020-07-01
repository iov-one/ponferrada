import { TxCodec } from "@iov/bcp";
import { FieldValidator, FormApi } from "final-form";
import {
  Block,
  composeValidators,
  FieldInputValue,
  Image,
  required,
  TextField,
  Typography,
} from "medulas-react-components";
import React, { useState } from "react";

import tickIcon from "../../../../assets/greenTick.svg";
import { isIovname } from "../../../../logic/account";

export const ADDRESS_FIELD = "addressField";

// NOTE always returns invalid while cert validation not implemented
const isCertValid = (_address: string): boolean => false;

interface Props {
  readonly form: FormApi;
  readonly selectedChainCodec: TxCodec | null;
  readonly noBalance: boolean;
  // NOTE prop for storybook testing while cert validation not implemented
  readonly initialHasValidCert?: boolean;
}

const ReceiverAddress = ({
  form,
  selectedChainCodec,
  noBalance,
  initialHasValidCert,
}: Props): JSX.Element => {
  const [addressHasValidCert, setAddressHasValidCert] = useState(initialHasValidCert);

  const recipientValidator = React.useMemo(() => {
    const validator: FieldValidator<FieldInputValue> = (value): string | undefined => {
      if (typeof value !== "string") throw new Error("Input must be a string");

      if (isIovname(value) || (selectedChainCodec && selectedChainCodec.isValidAddress(value))) {
        setAddressHasValidCert(isCertValid(value));

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
      <Block display="inline-flex" alignItems="center">
        <Typography color="textPrimary" variant="subtitle2">
          To
        </Typography>
        {addressHasValidCert && (
          <Block marginLeft="5px" display="inline-flex" alignItems="center">
            <Typography color="primary" variant="subtitle2">
              {" "}
              verified address
            </Typography>
            <Image height={14} alt="Green Tick" src={tickIcon} />
          </Block>
        )}
      </Block>
      <Block width="100%" marginTop={1}>
        <TextField
          name={ADDRESS_FIELD}
          form={form}
          validate={validator}
          placeholder="Recipient's address"
          disabled={noBalance}
          fullWidth
          margin="none"
        />
      </Block>
    </Block>
  );
};

export default ReceiverAddress;
