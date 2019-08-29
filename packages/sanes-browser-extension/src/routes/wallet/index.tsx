import {
  Block,
  Drawer,
  Form,
  Hairline,
  Link,
  PageLayout,
  SelectFieldForm,
  SelectFieldFormItem,
  ToastContext,
  ToastVariant,
  Typography,
} from "medulas-react-components";
import * as React from "react";
import { useForm } from "react-final-form-hooks";

import { PersonaContext } from "../../context/PersonaProvider";
import { getConfigurationFile } from "../../extension/background/model/persona/config";
import { EXTENSION_HEIGHT } from "../../theme/constants";
import { clearDatabase, clearPersona, createAccount } from "../../utils/chrome";
import { history } from "../../utils/history";
import {
  RECOVERY_PHRASE_ROUTE,
  REQUEST_ROUTE,
  TERMS_URL,
  WALLET_STATUS_ROUTE,
  WELCOME_ROUTE,
} from "../paths";
import deleteWalletIcon from "./assets/deleteWallet.svg";
import recoveryPhraseIcon from "./assets/recoveryPhrase.svg";
import requestsIcon from "./assets/requests.svg";
import ListTxs from "./components/ListTxs";

const CREATE_NEW_ONE = "Create a new one";

const DRAWER_HEIGHT = 56;
const CONTENT_HEIGHT = EXTENSION_HEIGHT - DRAWER_HEIGHT;

const AccountView = (): JSX.Element => {
  const [accounts, setAccounts] = React.useState<SelectFieldFormItem[]>([]);
  const toast = React.useContext(ToastContext);
  const personaProvider = React.useContext(PersonaContext);
  const { form, handleSubmit } = useForm({
    onSubmit: () => {},
  });

  React.useEffect(() => {
    async function fetchMyAccounts(): Promise<void> {
      const actualItems: SelectFieldFormItem[] = [
        { name: CREATE_NEW_ONE },
        ...personaProvider.accounts.map(account => ({ name: account.label })),
      ];
      setAccounts(actualItems);
    }

    fetchMyAccounts();
  }, [personaProvider.accounts]);

  const onChange = async (item: SelectFieldFormItem): Promise<void> => {
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
      icon: recoveryPhraseIcon,
      text: "Recovery words",
      action: () => history.push(RECOVERY_PHRASE_ROUTE),
    },
    {
      icon: requestsIcon,
      text: "Requests",
      action: () => history.push(REQUEST_ROUTE),
    },
    {
      icon: deleteWalletIcon,
      text: "Delete Wallet",
      action: async () => {
        // TODO: Ask for confirmation
        try {
          await clearPersona();
          await clearDatabase();
        } catch (error) {
          toast.show("An error occurred during deleting wallet", ToastVariant.ERROR);
          console.error(error);
          return;
        }
        history.replace(WELCOME_ROUTE);
      },
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
      <PageLayout id={WALLET_STATUS_ROUTE} primaryTitle="Wallet" title="Status" minHeight={CONTENT_HEIGHT}>
        {accountLoaded && (
          <Form onSubmit={handleSubmit}>
            <Block marginBottom={1}>
              <Typography variant="subtitle2">Available accounts</Typography>
            </Block>
            <SelectFieldForm
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
      </PageLayout>
    </Drawer>
  );
};

export default AccountView;
