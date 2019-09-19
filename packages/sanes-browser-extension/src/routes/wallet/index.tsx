import {
  Block,
  Drawer,
  Form,
  Hairline,
  Link,
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
import { history } from "../../utils/history";
import {
  DELETE_WALLET_ROUTE,
  RECOVERY_WORDS_ROUTE,
  REQUEST_ROUTE,
  TERMS_URL,
  WALLET_STATUS_ROUTE,
} from "../paths";
import deleteWalletIcon from "./assets/deleteWallet.svg";
import recoveryWordsIcon from "./assets/recoveryWords.svg";
import requestsIcon from "./assets/requests.svg";
import ListTxs from "./components/ListTxs";

const CREATE_NEW_ONE = "Create a new one";

const DRAWER_HEIGHT = 56;
const CONTENT_HEIGHT = EXTENSION_HEIGHT - DRAWER_HEIGHT;

const AccountView = (): JSX.Element => {
  const [accounts, setAccounts] = React.useState<SelectFieldItem[]>([]);
  const toast = React.useContext(ToastContext);
  const personaProvider = React.useContext(PersonaContext);
  const { form, handleSubmit } = useForm({
    onSubmit: () => {},
  });

  React.useEffect(() => {
    async function fetchMyAccounts(): Promise<void> {
      const actualItems: SelectFieldItem[] = [
        { name: CREATE_NEW_ONE },
        ...personaProvider.accounts.map(account => ({ name: account.label })),
      ];
      setAccounts(actualItems);
    }

    fetchMyAccounts();
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

  const items = [
    {
      icon: recoveryWordsIcon,
      text: "Recovery words",
      action: () => history.push(RECOVERY_WORDS_ROUTE),
    },
    {
      icon: requestsIcon,
      text: "Requests",
      action: () => history.push(REQUEST_ROUTE),
    },
    {
      icon: deleteWalletIcon,
      text: "Delete Wallet",
      action: () => history.push(DELETE_WALLET_ROUTE),
    },
  ];

  const footer = (
    <Block marginTop={4} textAlign="center">
      <Block marginBottom={1}>
        <Link to={TERMS_URL}>
          <Typography variant="subtitle2" color="primary" link inline>
            Terms &amp; Conditions
          </Typography>
        </Link>
      </Block>
    </Block>
  );

  return (
    <Drawer items={items} footer={footer}>
      <NeumaPageLayout
        id={WALLET_STATUS_ROUTE}
        primaryTitle="Wallet"
        title="Status"
        minHeight={CONTENT_HEIGHT}
      >
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
    </Drawer>
  );
};

export default AccountView;
