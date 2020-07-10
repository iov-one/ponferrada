import { FormStatus } from "forms";
import { Back, Block, Button } from "medulas-react-components";
import React from "react";

interface Props {
  status: FormStatus;
  onCancel: () => void;
}

export const Buttons: React.FC<Props> = (props: Props): React.ReactElement => {
  const { status } = props;
  return (
    <Block
      marginTop={4}
      marginBottom={1}
      justifyContent="center"
      display="flex"
      alignItems="center"
      flexDirection="column"
    >
      <Block width="75%">
        <Button
          fullWidth
          type={"submit"}
          disabled={status !== FormStatus.Valid}
          spinner={status === FormStatus.Validating || status === FormStatus.Submitting}
        >
          Register
        </Button>
      </Block>
      <Block width={"75%"} marginTop={1}>
        <Back fullWidth disabled={status === FormStatus.Submitting} onClick={props.onCancel}>
          Cancel
        </Back>
      </Block>
    </Block>
  );
};
