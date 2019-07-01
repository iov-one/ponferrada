import Block from 'medulas-react-components/lib/components/Block';
import Drawer from 'medulas-react-components/lib/components/Drawer';
import Form from 'medulas-react-components/lib/components/forms/Form';
import SelectField, { Item } from 'medulas-react-components/lib/components/forms/SelectFieldForm';
import Hairline from 'medulas-react-components/lib/components/Hairline';
import PageLayout from 'medulas-react-components/lib/components/PageLayout';
import Typography from 'medulas-react-components/lib/components/Typography';
import * as React from 'react';
import { useForm } from 'react-final-form-hooks';
import { PersonaContext } from '../../context/PersonaProvider';
import { history } from '../../store/reducers';
import { EXTENSION_HEIGHT } from '../../theme/constants';
import { createAccount } from '../../utils/chrome';
import { ACCOUNT_STATUS_ROUTE, RECOVERY_PHRASE_ROUTE, REQUEST_ROUTE } from '../paths';
import recoveryPhrase from './assets/recoveryPhrase.svg';
import requests from './assets/requests.svg';
import ListTxs from './components/ListTxs';
import Link from 'medulas-react-components/lib/components/Link';

const CREATE_NEW_ONE = 'Create a new one';

const DRAWER_HEIGHT = 56;
const CONTENT_HEIGHT = EXTENSION_HEIGHT - DRAWER_HEIGHT;

const AccountView = (): JSX.Element => {
  const [accounts, setAccounts] = React.useState<Item[]>([]);
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
        <Block marginTop={2}>
          <Link to="https://support.iov.one/hc/en-us">
            <Typography variant="subtitle2" color="primary" align="right" link>
              Terms and Conditions of use
            </Typography>
          </Link>
        </Block>
      </PageLayout>
    </Drawer>
  );
};

export default AccountView;
