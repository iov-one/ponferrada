import * as React from 'react';
import Layout from './components';
import { ACCOUNT_STATUS_ROUTE } from '../paths';
import { history } from '../../store/reducers/';
import { PersonaContext } from '../../context/PersonaProvider';
import { sendGetPersonaMessage } from '../../extension/messages';

const goToAccountStatus = (): void => {
  history.push(ACCOUNT_STATUS_ROUTE);
};

const Welcome = (): JSX.Element => {
  const personaProvider = React.useContext(PersonaContext);

  async function onLoad(): Promise<void> {
    if (typeof chrome !== 'undefined') {
      const response = await sendGetPersonaMessage();
      if (response) {
        personaProvider.update(response.accounts, response.mnemonic, response.txs);
        goToAccountStatus();
      }
    }
  }

  React.useEffect(() => {
    onLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Layout />;
};

export default Welcome;
