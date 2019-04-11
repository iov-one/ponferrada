import * as config from './configurationfile';
import { threeChainsConfig } from '../test/chainConfigBuilder';
import { getRuntimeConfiguration } from './runtimeconfiguration';

describe('getRuntimeConfiguration', () => {
  // This mocks getConfigurationFile but still needs a network connection to the blockchains.
  // Thus the mocking is mostly pointles. Code remain in here to demonstarte how mocking looks like.
  xit('mocks correctly chain config', async () => {
    const fetchConfigMock = jest.spyOn(config, 'getConfigurationFile');
    fetchConfigMock.mockImplementation(threeChainsConfig);
    expect((await getRuntimeConfiguration()).chains.length).toEqual(3);

    fetchConfigMock.mockRestore();

    expect((await getRuntimeConfiguration()).chains.length).toEqual(4);
  });
});
