import * as React from 'react';
import Block from 'medulas-react-components/lib/components/Block';
import Hairline from 'medulas-react-components/lib/components/Hairline';
import Drawer from 'medulas-react-components/lib/components/Drawer';
import PageLayout from 'medulas-react-components/lib/components/PageLayout';
import { ToastContext } from 'medulas-react-components/lib/context/ToastProvider';
import { ToastVariant } from 'medulas-react-components/lib/context/ToastProvider/Toast';
import Typography from 'medulas-react-components/lib/components/Typography';
import { ACCOUNT_STATUS_ROUTE, WELCOME_ROUTE } from '../paths';
import SelectField, { Item } from 'medulas-react-components/lib/components/forms/SelectFieldForm';
import { useForm } from 'react-final-form-hooks';
import Form from 'medulas-react-components/lib/components/forms/Form';
import { PersonaContext } from '../../context/PersonaProvider';
import ListTxs from './components/ListTxs';
import { history } from '../../store/reducers';

const CREATE_NEW_ONE = 'Create a new one';

const AccountView = (): JSX.Element => {
  const [accounts, setAccounts] = React.useState<Item[]>([]);
  const personaProvider = React.useContext(PersonaContext);
  const { show } = React.useContext(ToastContext);
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

  const onChange = (item: Item): void => {
    if (item.name === CREATE_NEW_ONE) {
      show('Feature coming soon. Stay tuned', ToastVariant.INFO);
      return;
    }
  };
  const accountLoaded = accounts.length > 1;

  const items = [
    {
      text: 'Show recovery words',
      action: () => history.push(WELCOME_ROUTE),
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
          <ListTxs title="Transations" txs={personaProvider.txs} />
        </Block>
        <Block marginBottom={1}>
          <ListTxs title="Pending Transactions" txs={[]} />
        </Block>
      </PageLayout>
    </Drawer>
  );
};

export default AccountView;
