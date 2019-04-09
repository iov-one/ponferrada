import { FullConfigurationFile } from '../blockchain/chainsConfig/fetchConfig';

export const threeChainsConfig = (): Promise<FullConfigurationFile> => {
  const config: FullConfigurationFile = {
    chains: [
      {
        chainSpec: {
          codecType: 'bns',
          bootstrapNodes: ['ws://localhost:23456/'],
        },
        faucetSpec: {
          uri: 'http://localhost:8000',
          token: 'IOV',
        },
      },
      {
        chainSpec: {
          codecType: 'bov',
          bootstrapNodes: ['ws://localhost:23457/'],
        },
        faucetSpec: {
          uri: 'http://localhost:8001',
          token: 'BOV',
        },
      },
      {
        chainSpec: {
          codecType: 'lsk',
          bootstrapNodes: ['http://localhost:4000/'],
        },
        faucetSpec: {
          uri: 'http://localhost:8002',
          token: 'LSK',
        },
      },
    ],
  };

  return Promise.resolve(config);
};
