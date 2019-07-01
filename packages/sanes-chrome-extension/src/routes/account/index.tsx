import Block from 'medulas-react-components/lib/components/Block';
import Drawer from 'medulas-react-components/lib/components/Drawer';
import Form from 'medulas-react-components/lib/components/forms/Form';
import SelectField, { Item } from 'medulas-react-components/lib/components/forms/SelectFieldForm';
import Hairline from 'medulas-react-components/lib/components/Hairline';
import PageLayout from 'medulas-react-components/lib/components/PageLayout';
import Typography from 'medulas-react-components/lib/components/Typography';
import { ToastContext } from 'medulas-react-components/lib/context/ToastProvider';
import { ToastVariant } from 'medulas-react-components/lib/context/ToastProvider/Toast';
import * as React from 'react';
import { useForm } from 'react-final-form-hooks';
import { PersonaContext } from '../../context/PersonaProvider';
import { history } from '../../store/reducers';
import { EXTENSION_HEIGHT } from '../../theme/constants';
import { clearDatabase, clearPersona, createAccount } from '../../utils/chrome';
import { ACCOUNT_STATUS_ROUTE, RECOVERY_PHRASE_ROUTE, REQUEST_ROUTE, WELCOME_ROUTE } from '../paths';
import recoveryPhrase from './assets/recoveryPhrase.svg';
import requests from './assets/requests.svg';
import terms from './assets/terms.svg';
import ListTxs from './components/ListTxs';

const CREATE_NEW_ONE = 'Create a new one';

const DRAWER_HEIGHT = 56;
const CONTENT_HEIGHT = EXTENSION_HEIGHT - DRAWER_HEIGHT;

const AccountView = (): JSX.Element => {
  const [accounts, setAccounts] = React.useState<Item[]>([]);
  const toast = React.useContext(ToastContext);
  const personaProvider = React.useContext(PersonaContext);
  const { form, handleSubmit } = useForm({
    onSubmit: () => {},
  });

  React.useEffect(() => {
    async function fetchMyAccounts(): Promise<void> {
      const actualItems: Item[] = [
        { name: CREATE_NEW_ONE },
        ...personaProvider.accounts.map(account => ({ name: account.label })),
      ];
      setAccounts(actualItems);
    }

    fetchMyAccounts();
  }, [personaProvider.accounts]);

  const onChange = async (item: Item): Promise<void> => {
    if (item.name === CREATE_NEW_ONE) {
      const accounts = await createAccount();
      personaProvider.update({ accounts });
    }
  };
  const accountLoaded = accounts.length > 1;

  const items = [
    {
      icon: recoveryPhrase,
      text: 'Recovery words',
      action: () => history.push(RECOVERY_PHRASE_ROUTE),
    },
    {
      icon: requests,
      text: 'Requests',
      action: () => history.push(REQUEST_ROUTE),
    },
    {
      icon: requests, // TODO: proper item missing
      text: 'Logout',
      action: async () => {
        // TODO: Ask for confirmation
        try {
          await clearPersona();
          await clearDatabase();
        } catch (error) {
          toast.show('An error occurred during logout', ToastVariant.ERROR);
          // eslint-disable-next-line no-console
          console.error(error);
          return;
        }
        history.replace(WELCOME_ROUTE);
      },
    },
    {
      icon: terms,
      text: 'Terms & Conditions',
      action: () => window.open('https://support.iov.one/hc/en-us', '_blank'),
    },
  ];

  return (
    <Drawer items={items}>
      <PageLayout id={ACCOUNT_STATUS_ROUTE} primaryTitle="Account" title="Status" minHeight={CONTENT_HEIGHT}>
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
          <ListTxs title="Transactions" txs={personaProvider.txs} />
        </Block>
      </PageLayout>
    </Drawer>
  );
};

export default AccountView;
