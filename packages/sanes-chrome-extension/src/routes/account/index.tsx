import * as React from 'react';
import Typography from 'medulas-react-components/lib/components/Typography';
import Block from 'medulas-react-components/lib/components/Block';
import Hairline from 'medulas-react-components/lib/components/Hairline';
import Image from 'medulas-react-components/lib/components/Image';
import iovLogo from '../../assets/iov-logo.png';
import { SIGNUP_ROUTE } from '../paths';
import Account from './components/Account';
import SelectField, { Item } from 'medulas-react-components/lib/components/forms/SelectFieldForm';
import { useForm } from 'react-final-form-hooks';
import Form from 'medulas-react-components/lib/components/forms/Form';
import { PersonaContext } from '../../context/PersonaProvider';
import { AccountInfo } from '../../logic/persona/accountManager';

const CREATE_NEW_ONE = 'Create a new one';

const AccountView = (): JSX.Element => {
  const [accounts, setAccounts] = React.useState<Item[]>([]);
  const persona = React.useContext(PersonaContext);
  const { form, handleSubmit } = useForm({
    onSubmit: () => {},
  });

  React.useEffect(() => {
    async function fetchMyAccounts(): Promise<void> {
      const accounts = persona.accountNames;
      let actualItems: Item[] = [];
      accounts.forEach((acc: AccountInfo) => actualItems.push({ name: acc.name }));
      actualItems.push({ name: CREATE_NEW_ONE });
      setAccounts(actualItems);
    }

    fetchMyAccounts();
  }, [persona.accountNames]);

  const onChange = (item: Item): void => {
    if (item.name === CREATE_NEW_ONE) {
      // Here the code for adding a new Account
      // See src/logic/index.ts >> buildPersona method
      /*
      if (!persona.current) {
        return;
      }
      persona.current.addAccount(....);
      setAccounts(actualItems => [...actualItems, { name: 'Just created Account'}])
      */
      return;
    }

    // const tokensPerAccount = calculate tokens from choosen acccount
    // setTokens(tokensPerAccount)
  };

  return (
    <Block id={`${SIGNUP_ROUTE}_first`} paddingRight={2} paddingLeft={2} paddingTop={2}>
      <Typography color="primary" variant="h4" inline>
        New
      </Typography>
      <Typography variant="h4" inline>
        {' Account'}
      </Typography>
      <Hairline space={1} />
      <Form onSubmit={handleSubmit}>
        <SelectField
          items={accounts}
          initial={CREATE_NEW_ONE}
          form={form}
          fieldName="SELECT_FIELD_ATTR"
          onChangeCallback={onChange}
        />
      </Form>

      <Hairline space={1} />
      <Block padding={2} marginTop={3} marginBottom={1}>
        <Account blockchainAccounts={['foo', 'bar', 'baz']} />
      </Block>
      <Hairline space={1} />
      <Block textAlign="center" marginBottom={1}>
        <Image src={iovLogo} alt="IOV logo" />
      </Block>
    </Block>
  );
};

export default AccountView;
