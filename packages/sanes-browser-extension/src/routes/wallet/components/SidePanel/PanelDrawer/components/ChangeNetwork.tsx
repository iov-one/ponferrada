import {
  Back,
  Block,
  Button,
  Form,
  FormValues,
  TextField,
  Typography,
  useForm,
  ValidationError,
} from "medulas-react-components";
import React, { useContext, useEffect, useState } from "react";

import { Views } from "..";
import { PersonaContext } from "../../../../../../context/PersonaProvider";
import { storeBnsRpc } from "../../../../../../utils/localstorage/bnsRpc";
import { logOut } from "./Menu";
import { getNetworks } from "./Networks";

export const networkNameField = "networkNameField";
export const rpcUrlField = "rpcUrlField";

interface InitialValues {
  readonly [networkNameField]?: string;
  readonly [rpcUrlField]?: string;
}

interface Props {
  readonly updateCurrentView: (newView: Views) => void;
}

const ChangeNetwork = ({ updateCurrentView }: Props): JSX.Element => {
  const connectedChains = useContext(PersonaContext).connectedChains;
  const [initialValues, setInititalValues] = useState<InitialValues>({});

  useEffect(() => {
    let isSubscribed = true;

    async function updateNetworks(): Promise<void> {
      const networks = await getNetworks(connectedChains);
      const bnsNetwork = networks.find(net => net.isBNS);

      if (isSubscribed && bnsNetwork) {
        setInititalValues({
          [networkNameField]: bnsNetwork.name,
          [rpcUrlField]: bnsNetwork.node,
        });
      }
    }

    updateNetworks();

    return () => {
      isSubscribed = false;
    };
  }, [connectedChains]);

  const onSubmit = async (formValues: FormValues): Promise<void> => {
    const networkName = formValues[networkNameField];
    const rpcUrl = formValues[rpcUrlField];

    storeBnsRpc({ networkName, rpcUrl });
    logOut();
  };

  const validate = (values: object): object => {
    const formValues = values as FormValues;
    const errors: ValidationError = {};
    if (!formValues[networkNameField]) {
      errors[networkNameField] = "Required";
    }
    if (!formValues[rpcUrlField]) {
      errors[rpcUrlField] = "Required";
    }
    if (!/^https?:\/\//.test(formValues[rpcUrlField])) {
      errors[rpcUrlField] = "Should be valid URL";
    }

    return errors;
  };

  const onCancel = (): void => updateCurrentView(Views.Networks);

  const { form, handleSubmit, pristine, submitting, invalid } = useForm({
    onSubmit,
    validate,
    initialValues,
  });

  return (
    <Block width="100%">
      <Block marginLeft={3} marginRight={3}>
        <Block marginTop={4} />
        <Form onSubmit={handleSubmit}>
          <Block marginBottom={2}>
            <Typography color="default" variant="subtitle2">
              Network Name
            </Typography>
            <TextField type="text" form={form} required fullWidth name={networkNameField} />
          </Block>
          <Block marginBottom={2}>
            <Typography color="default" variant="subtitle2">
              RPC URL
            </Typography>
            <TextField type="text" form={form} required fullWidth name={rpcUrlField} />
          </Block>
          <Button fullWidth type="submit" disabled={invalid || pristine || submitting}>
            Save
          </Button>
          <Block marginBottom={1} />
          <Back fullWidth color="secondary" onClick={onCancel}>
            Cancel
          </Back>
        </Form>
      </Block>
    </Block>
  );
};

export default ChangeNetwork;
