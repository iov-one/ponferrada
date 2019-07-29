import { singleton } from 'medulas-react-components/lib/utils/singleton';

import developmentConfig from './development.json';
import productionConfig from './production.json';
import stagingConfig from './staging.json';

export interface Config {
  readonly extensionId: string;
}

const configuration = (): Config => {
  console.log(process.env.REACT_APP_CONFIG);
  if (process.env.REACT_APP_CONFIG === 'development') {
    return developmentConfig;
  }

  if (process.env.REACT_APP_CONFIG === 'staging') {
    return stagingConfig;
  }

  if (process.env.REACT_APP_CONFIG === 'production') {
    return productionConfig;
  }

  throw new Error('Unexpected REACT_APP_CONFIG variable for obtaining configuration');
};

export const getConfig = singleton<typeof configuration>(configuration);
