import {
  Block,
  Form,
  Hairline,
  SelectField,
  SelectFieldItem,
  ToastContext,
  ToastVariant,
  Typography,
} from "medulas-react-components";
import * as React from "react";
import { useForm } from "react-final-form-hooks";

import NeumaPageLayout from "../../components/NeumaPageLayout";
import { PersonaContext } from "../../context/PersonaProvider";
import { getConfigurationFile } from "../../extension/background/model/persona/config";
import { EXTENSION_HEIGHT } from "../../theme/constants";
import { createAccount } from "../../utils/chrome";
import { WALLET_STATUS_ROUTE } from "../paths";
import ListTxs from "./components/ListTxs";
import SidePanel from "./components/SidePanel";
import { toolbarHeight } from "./components/SidePanel/PanelDrawer";

const CREATE_NEW_ONE = "Create a new one";

const CONTENT_HEIGHT = EXTENSION_HEIGHT - toolbarHeight;

const AccountView = (): JSX.Element => {
  const [accounts, setAccounts] = React.useState<SelectFieldItem[]>([]);
  const toast = React.useContext(ToastContext);
  const personaProvider = React.useContext(PersonaContext);
  const { form, handleSubmit } = useForm({
    onSubmit: () => {},
  });

  React.useEffect(() => {
    let isSubscribed = true;

    async function fetchMyAccounts(): Promise<void> {
      const actualItems: SelectFieldItem[] = [
        { name: CREATE_NEW_ONE },
        ...personaProvider.accounts.map(account => ({ name: account.label })),
      ];

      if (isSubscribed) {
        setAccounts(actualItems);
      }
    }

    fetchMyAccounts();

    return () => {
      isSubscribed = false;
    };
  }, [personaProvider.accounts]);

  const onChange = async (item: SelectFieldItem): Promise<void> => {
    if (item.name === CREATE_NEW_ONE) {
      if ((await getConfigurationFile()).accountCreationDisabled) {
        toast.show(
          "Account creation is currently disabled. Support for multiple accounts will follow soon.",
          ToastVariant.INFO,
        );
      } else {
        const accounts = await createAccount();
        personaProvider.update({ accounts });
      }
    }
  };
  const accountLoaded = accounts.length > 1;

  return (
    <SidePanel>
      <NeumaPageLayout id={WALLET_STATUS_ROUTE} primaryTitle="" title="" minHeight={CONTENT_HEIGHT}>
        {accountLoaded && (
          <Form onSubmit={handleSubmit}>
            <Block marginBottom={1}>
              <Typography variant="subtitle2">Available accounts</Typography>
            </Block>
            <SelectField
              items={accounts}
              initial={accounts[1].name}
              form={form}
              fieldName="SELECT_FIELD_ATTR"
              onChangeCallback={onChange}
            />
          </Form>
        )}
        <Hairline space={2} />
        <Block>
          <ListTxs title="Signed Transactions" txs={personaProvider.txs} />
        </Block>
      </NeumaPageLayout>
    </SidePanel>
  );
};

export default AccountView;
