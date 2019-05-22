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
import { sendCreateAccountMessage } from '../../extension/background/messages';
import { history } from '../../store/reducers';
import { ACCOUNT_STATUS_ROUTE, RECOVERY_PHRASE_ROUTE, REQUEST_ROUTE } from '../paths';
import ListTxs from './components/ListTxs';

const CREATE_NEW_ONE = 'Create a new one';

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
      const response = await sendCreateAccountMessage();
      personaProvider.update({ accounts: response.accounts });
    }
  };
  const accountLoaded = accounts.length > 1;

  const items = [
    {
      text: 'Show recovery words',
      action: () => history.push(RECOVERY_PHRASE_ROUTE),
    },
    {
      text: 'Requests',
      action: () => history.push(REQUEST_ROUTE),
    },
  ];

  return (
    <Drawer items={items}>
      <PageLayout id={ACCOUNT_STATUS_ROUTE} primaryTitle="Account" title="Status">
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
        <Block marginBottom={4}>
          <ListTxs title="Transactions" txs={personaProvider.txs} />
        </Block>
      </PageLayout>
    </Drawer>
  );
};

export default AccountView;
